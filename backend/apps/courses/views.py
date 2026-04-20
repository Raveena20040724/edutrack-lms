from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import Course, Lesson, Enrollment, LessonProgress, CourseReview
from .serializers import (
    CourseSerializer, CourseDetailSerializer, LessonSerializer,
    EnrollmentSerializer, LessonProgressSerializer, CourseReviewSerializer,
)
from apps.users.permissions import IsAdminUser, IsTrainerUser


# ── Courses ───────────────────────────────────────────────────────────────────

class CourseListView(generics.ListCreateAPIView):
    """
    GET  /api/courses/          — All users: list all active courses
    POST /api/courses/          — Trainer/Admin: create course
    """
    def get_serializer_class(self):
        return CourseSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTrainerUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs       = Course.objects.filter(is_active=True).order_by('-created_at')
        category = self.request.query_params.get('category')
        search   = self.request.query_params.get('search')
        if category:
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(title__icontains=search)
        return qs

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/courses/<id>/   — All authenticated
    PUT    /api/courses/<id>/   — Trainer (owner) or Admin
    DELETE /api/courses/<id>/   — Admin only
    """
    queryset = Course.objects.all()

    def get_serializer_class(self):
        return CourseDetailSerializer

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsTrainerUser()]
        return [permissions.IsAuthenticated()]


# ── Lessons ───────────────────────────────────────────────────────────────────

class LessonListView(generics.ListCreateAPIView):
    """
    GET  /api/courses/<course_id>/lessons/   — enrolled students or trainer
    POST /api/courses/<course_id>/lessons/   — Trainer/Admin only
    """
    serializer_class = LessonSerializer
    parser_classes   = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsTrainerUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_id']).order_by('order')

    def perform_create(self, serializer):
        course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        serializer.save(course=course)


class LessonDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PUT/DELETE /api/courses/<course_id>/lessons/<id>/"""
    serializer_class = LessonSerializer
    parser_classes   = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsTrainerUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Lesson.objects.filter(course_id=self.kwargs['course_id'])


# ── Enrollments ───────────────────────────────────────────────────────────────

class EnrollView(APIView):
    """POST /api/courses/<course_id>/enroll/  — Student enrolls in a course"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id):
        if request.user.role != 'student':
            return Response({'detail': 'Only students can enroll.'}, status=status.HTTP_403_FORBIDDEN)
        course = get_object_or_404(Course, pk=course_id, is_active=True)
        enrollment, created = Enrollment.objects.get_or_create(student=request.user, course=course)
        if not created:
            return Response({'detail': 'Already enrolled.'}, status=status.HTTP_200_OK)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UnenrollView(APIView):
    """DELETE /api/courses/<course_id>/unenroll/"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, course_id):
        enrollment = get_object_or_404(Enrollment, student=request.user, course_id=course_id)
        enrollment.delete()
        return Response({'detail': 'Unenrolled successfully.'}, status=status.HTTP_204_NO_CONTENT)


class MyEnrollmentsView(generics.ListAPIView):
    """GET /api/courses/my-enrollments/  — Student: list their enrolled courses"""
    serializer_class   = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user).select_related('course')


class CourseStudentsView(generics.ListAPIView):
    """GET /api/courses/<course_id>/students/  — Trainer: see enrolled students"""
    permission_classes = [IsTrainerUser]

    def get(self, request, course_id):
        course      = get_object_or_404(Course, pk=course_id)
        enrollments = Enrollment.objects.filter(course=course).select_related('student')
        data = [
            {
                'id':       e.student.id,
                'name':     e.student.full_name,
                'email':    e.student.email,
                'progress': e.progress,
                'enrolled_at': e.enrolled_at,
            }
            for e in enrollments
        ]
        return Response(data)


# ── Lesson Progress ───────────────────────────────────────────────────────────

class MarkLessonDoneView(APIView):
    """POST /api/courses/<course_id>/lessons/<lesson_id>/complete/"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, course_id, lesson_id):
        enrollment = get_object_or_404(Enrollment, student=request.user, course_id=course_id)
        lesson     = get_object_or_404(Lesson, pk=lesson_id, course_id=course_id)
        progress, _ = LessonProgress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
        progress.completed = True
        progress.save()
        return Response({'detail': 'Lesson marked as complete.', 'course_progress': enrollment.progress})


class LessonProgressListView(generics.ListAPIView):
    """GET /api/courses/<course_id>/progress/  — Student's progress for a course"""
    serializer_class   = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        enrollment = get_object_or_404(Enrollment, student=self.request.user, course_id=self.kwargs['course_id'])
        return LessonProgress.objects.filter(enrollment=enrollment)


# ── Reviews ───────────────────────────────────────────────────────────────────

class CourseReviewView(generics.ListCreateAPIView):
    """GET/POST /api/courses/<course_id>/reviews/"""
    serializer_class   = CourseReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CourseReview.objects.filter(course_id=self.kwargs['course_id'])

    def perform_create(self, serializer):
        course = get_object_or_404(Course, pk=self.kwargs['course_id'])
        serializer.save(student=self.request.user, course=course)


# ── Trainer: My Courses ───────────────────────────────────────────────────────

class TrainerCoursesView(generics.ListAPIView):
    """GET /api/courses/my-courses/  — Trainer: courses they teach"""
    serializer_class   = CourseSerializer
    permission_classes = [IsTrainerUser]

    def get_queryset(self):
        return Course.objects.filter(instructor=self.request.user).order_by('-created_at')


# ── Admin: All Courses ────────────────────────────────────────────────────────

class AdminCourseListView(generics.ListAPIView):
    """GET /api/courses/admin/all/  — Admin: all courses including inactive"""
    serializer_class   = CourseSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return Course.objects.all().order_by('-created_at')
