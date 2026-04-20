from rest_framework import serializers
from django.utils import timezone
from .models import Assignment, Submission


class AssignmentSerializer(serializers.ModelSerializer):
    course_title      = serializers.CharField(source='course.title',    read_only=True)
    course_icon       = serializers.CharField(source='course.icon',     read_only=True)
    created_by_name   = serializers.CharField(source='created_by.full_name', read_only=True)
    submission_status = serializers.SerializerMethodField()
    is_overdue        = serializers.SerializerMethodField()

    class Meta:
        model  = Assignment
        fields = [
            'id', 'course', 'course_title', 'course_icon',
            'title', 'instructions', 'due_date', 'max_score',
            'created_by', 'created_by_name',
            'submission_status', 'is_overdue', 'created_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at']

    def get_submission_status(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'student':
            sub = obj.submissions.filter(student=request.user).first()
            if sub:
                return sub.status
        return 'not_submitted'

    def get_is_overdue(self, obj):
        return obj.due_date < timezone.now().date()


class SubmissionSerializer(serializers.ModelSerializer):
    student_name    = serializers.CharField(source='student.full_name',    read_only=True)
    student_email   = serializers.CharField(source='student.email',        read_only=True)
    assignment_title = serializers.CharField(source='assignment.title',    read_only=True)
    course_title    = serializers.CharField(source='assignment.course.title', read_only=True)
    percentage      = serializers.ReadOnlyField()
    graded_by_name  = serializers.CharField(source='graded_by.full_name', read_only=True)

    class Meta:
        model  = Submission
        fields = [
            'id', 'assignment', 'assignment_title', 'course_title',
            'student', 'student_name', 'student_email',
            'file', 'notes', 'status', 'score', 'percentage',
            'feedback', 'graded_by', 'graded_by_name',
            'submitted_at', 'graded_at',
        ]
        read_only_fields = [
            'id', 'student', 'status', 'score', 'feedback',
            'graded_by', 'submitted_at', 'graded_at',
        ]


class GradeSubmissionSerializer(serializers.ModelSerializer):
    """Used by trainer to grade a submission."""
    class Meta:
        model  = Submission
        fields = ['score', 'feedback', 'status']

    def validate_score(self, value):
        max_score = self.instance.assignment.max_score
        if value > max_score:
            raise serializers.ValidationError(f'Score cannot exceed {max_score}.')
        return value

    def update(self, instance, validated_data):
        instance.score     = validated_data.get('score', instance.score)
        instance.feedback  = validated_data.get('feedback', instance.feedback)
        instance.status    = validated_data.get('status', 'graded')
        instance.graded_by = self.context['request'].user
        instance.graded_at = timezone.now()
        instance.save()
        return instance
