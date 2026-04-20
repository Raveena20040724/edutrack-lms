from django.db import models
from django.conf import settings
from apps.courses.models import Course


class Assignment(models.Model):
    course       = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title        = models.CharField(max_length=200)
    instructions = models.TextField()
    due_date     = models.DateField()
    max_score    = models.PositiveIntegerField(default=100)
    created_by   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_assignments',
    )
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.course.title} — {self.title}"


class Submission(models.Model):
    STATUS_CHOICES = [
        ('submitted', 'Submitted'),
        ('graded',    'Graded'),
        ('returned',  'Returned for Revision'),
    ]

    assignment   = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    student      = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='submissions',
        limit_choices_to={'role': 'student'},
    )
    file         = models.FileField(upload_to='submissions/', blank=True, null=True)
    notes        = models.TextField(blank=True, help_text='Student notes to trainer')
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='submitted')
    score        = models.PositiveIntegerField(null=True, blank=True)
    feedback     = models.TextField(blank=True)
    graded_by    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='graded_submissions',
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    graded_at    = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('assignment', 'student')

    def __str__(self):
        return f"{self.student.username} → {self.assignment.title} ({self.status})"

    @property
    def percentage(self):
        if self.score is not None and self.assignment.max_score:
            return round((self.score / self.assignment.max_score) * 100, 1)
        return None
