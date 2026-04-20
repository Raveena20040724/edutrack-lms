from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Assignment, Submission
from .serializers import (
    AssignmentSerializer, SubmissionSerializer, GradeSubmissionSerializer,
)
from apps.users.permissions import IsTrainerUser, IsAdminUser


# ── Assignments ───────────────────────────────────────────────────────────────

class AssignmentListView(generics.ListCreateAPIView):
    """
    GET  /api/assignments/                — All authenticated: list assignments for enrolled courses
    POST /api/assignments/                — Trainer/Admin: create assignment
    """
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTrainerUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        qs   = Assignment.objects.select_related('course').order_by('-created_at')

        if user.role == 'student':
            # Only assignments for courses student is enrolled in
            enrolled_course_ids = user.enrollments.values_list('course_id', flat=True)
            qs = qs.filter(course_id__in=enrolled_course_ids)

        elif user.role == 'trainer':
            # Only assignments for their courses
            qs = qs.filter(course__instructor=user)

        # Filter by course
        course_id = self.request.query_params.get('course')
        if course_id:
            qs = qs.filter(course_id=course_id)

        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class AssignmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/assignments/<id>/"""
    serializer_class = AssignmentSerializer

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsTrainerUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Assignment.objects.all()


# ── Submissions ───────────────────────────────────────────────────────────────

class SubmitAssignmentView(APIView):
    """POST /api/assignments/<assignment_id>/submit/  — Student submits"""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, assignment_id):
        if request.user.role != 'student':
            return Response({'detail': 'Only students can submit assignments.'}, status=status.HTTP_403_FORBIDDEN)

        assignment = get_object_or_404(Assignment, pk=assignment_id)

        # Check already submitted
        if Submission.objects.filter(assignment=assignment, student=request.user).exists():
            return Response({'detail': 'You have already submitted this assignment.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(
                assignment=assignment,
                student=request.user,
                status='submitted',
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MySubmissionsView(generics.ListAPIView):
    """GET /api/assignments/my-submissions/  — Student: all their submissions"""
    serializer_class   = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Submission.objects.filter(student=self.request.user).select_related(
            'assignment', 'assignment__course'
        ).order_by('-submitted_at')


class SubmissionListView(generics.ListAPIView):
    """
    GET /api/assignments/<assignment_id>/submissions/
    Trainer: see all student submissions for an assignment
    """
    serializer_class   = SubmissionSerializer
    permission_classes = [IsTrainerUser]

    def get_queryset(self):
        return Submission.objects.filter(
            assignment_id=self.kwargs['assignment_id']
        ).select_related('student', 'assignment').order_by('-submitted_at')


class GradeSubmissionView(APIView):
    """
    POST /api/assignments/submissions/<submission_id>/grade/
    Trainer grades a submission
    """
    permission_classes = [IsTrainerUser]

    def post(self, request, submission_id):
        submission = get_object_or_404(Submission, pk=submission_id)
        serializer = GradeSubmissionSerializer(
            submission, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubmissionDetailView(generics.RetrieveAPIView):
    """GET /api/assignments/submissions/<id>/  — View a single submission"""
    serializer_class   = SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset           = Submission.objects.all()


# ── Analytics / Reports ───────────────────────────────────────────────────────

class StudentResultsView(APIView):
    """GET /api/assignments/results/  — Student: summary of all scores"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        submissions = Submission.objects.filter(
            student=request.user, status='graded'
        ).select_related('assignment', 'assignment__course')

        data = [
            {
                'assignment':  s.assignment.title,
                'course':      s.assignment.course.title,
                'score':       s.score,
                'max_score':   s.assignment.max_score,
                'percentage':  s.percentage,
                'feedback':    s.feedback,
                'graded_at':   s.graded_at,
            }
            for s in submissions
        ]

        avg = round(sum(d['percentage'] for d in data) / len(data), 1) if data else 0
        return Response({'average': avg, 'results': data})


class TrainerAnalyticsView(APIView):
    """GET /api/assignments/analytics/  — Trainer: overview of pending/graded"""
    permission_classes = [IsTrainerUser]

    def get(self, request):
        submissions = Submission.objects.filter(
            assignment__course__instructor=request.user
        ).select_related('assignment', 'student')

        pending = submissions.filter(status='submitted')
        graded  = submissions.filter(status='graded')

        scores = [s.score for s in graded if s.score is not None]
        avg    = round(sum(scores) / len(scores), 1) if scores else 0

        return Response({
            'total_submissions':   submissions.count(),
            'pending_count':       pending.count(),
            'graded_count':        graded.count(),
            'average_score':       avg,
            'pending_submissions': SubmissionSerializer(pending, many=True).data,
        })


class AdminAnalyticsView(APIView):
    """GET /api/assignments/admin/analytics/  — Admin: platform-wide stats"""
    permission_classes = [IsAdminUser]

    def get(self, request):
        all_subs = Submission.objects.select_related('assignment', 'student')
        graded   = all_subs.filter(status='graded')
        scores   = [s.score for s in graded if s.score is not None]
        avg      = round(sum(scores) / len(scores), 1) if scores else 0

        return Response({
            'total_submissions': all_subs.count(),
            'graded_count':      graded.count(),
            'pending_count':     all_subs.filter(status='submitted').count(),
            'average_score':     avg,
        })
