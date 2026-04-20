from django.contrib import admin
from .models import Assignment, Submission


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display  = ('title', 'course', 'due_date', 'max_score', 'created_by', 'created_at')
    list_filter   = ('course',)
    search_fields = ('title', 'course__title')
    ordering      = ('-created_at',)


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display  = ('student', 'assignment', 'status', 'score', 'percentage', 'submitted_at')
    list_filter   = ('status',)
    search_fields = ('student__username', 'assignment__title')
    ordering      = ('-submitted_at',)
