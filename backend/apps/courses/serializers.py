from rest_framework import serializers
from .models import Course, Lesson, Enrollment, LessonProgress, CourseReview
from apps.users.serializers import UserSerializer


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Lesson
        fields = ['id', 'title', 'description', 'video_url', 'video_file',
                  'duration', 'order', 'material', 'created_at']
        read_only_fields = ['id', 'created_at']


class CourseSerializer(serializers.ModelSerializer):
    instructor_name  = serializers.CharField(source='instructor.full_name', read_only=True)
    enrolled_count   = serializers.ReadOnlyField()
    lesson_count     = serializers.ReadOnlyField()
    rating           = serializers.ReadOnlyField()
    is_enrolled      = serializers.SerializerMethodField()

    class Meta:
        model  = Course
        fields = [
            'id', 'title', 'description', 'icon', 'category', 'duration',
            'instructor', 'instructor_name', 'thumbnail', 'is_active',
            'enrolled_count', 'lesson_count', 'rating', 'is_enrolled', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated and request.user.role == 'student':
            return obj.enrollments.filter(student=request.user).exists()
        return False


class CourseDetailSerializer(CourseSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta(CourseSerializer.Meta):
        fields = CourseSerializer.Meta.fields + ['lessons']


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title    = serializers.CharField(source='course.title', read_only=True)
    course_icon     = serializers.CharField(source='course.icon',  read_only=True)
    course_duration = serializers.CharField(source='course.duration', read_only=True)
    progress        = serializers.ReadOnlyField()

    class Meta:
        model  = Enrollment
        fields = ['id', 'course', 'course_title', 'course_icon',
                  'course_duration', 'progress', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']


class LessonProgressSerializer(serializers.ModelSerializer):
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model  = LessonProgress
        fields = ['id', 'lesson', 'lesson_title', 'completed', 'watched_at']
        read_only_fields = ['id', 'watched_at']


class CourseReviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model  = CourseReview
        fields = ['id', 'course', 'student', 'student_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'student', 'created_at']
