from django.contrib import admin
from .models import Course, Lesson, Enrollment, LessonProgress, CourseReview


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ('title', 'category', 'instructor', 'enrolled_count', 'is_active', 'created_at')
    list_filter   = ('category', 'is_active')
    search_fields = ('title', 'description')
    ordering      = ('-created_at',)


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display  = ('title', 'course', 'order', 'duration', 'created_at')
    list_filter   = ('course',)
    ordering      = ('course', 'order')


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display  = ('student', 'course', 'progress', 'enrolled_at')
    list_filter   = ('course',)
    search_fields = ('student__username', 'course__title')


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ('enrollment', 'lesson', 'completed', 'watched_at')
    list_filter  = ('completed',)


@admin.register(CourseReview)
class CourseReviewAdmin(admin.ModelAdmin):
    list_display  = ('student', 'course', 'rating', 'created_at')
    list_filter   = ('rating',)
