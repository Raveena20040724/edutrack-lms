from django.db import models
from django.conf import settings


class Course(models.Model):
    CATEGORY_CHOICES = [
        ('design',      'Design'),
        ('development', 'Development'),
        ('data',        'Data Science'),
        ('devops',      'DevOps'),
        ('marketing',   'Marketing'),
        ('other',       'Other'),
    ]

    title       = models.CharField(max_length=200)
    description = models.TextField()
    icon        = models.CharField(max_length=10, default='📚')
    category    = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    duration    = models.CharField(max_length=50, help_text='e.g. 8 weeks')
    instructor  = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='taught_courses',
        limit_choices_to={'role': 'trainer'},
    )
    thumbnail   = models.ImageField(upload_to='course_thumbnails/', blank=True, null=True)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    @property
    def enrolled_count(self):
        return self.enrollments.count()

    @property
    def lesson_count(self):
        return self.lessons.count()

    @property
    def rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)


class Lesson(models.Model):
    course      = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    video_file  = models.FileField(upload_to='videos/', blank=True, null=True)
    video_url   = models.URLField(blank=True)           # External URL fallback
    duration    = models.CharField(max_length=20, blank=True, help_text='e.g. 18 min')
    order       = models.PositiveIntegerField(default=0)
    material    = models.FileField(upload_to='materials/', blank=True, null=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} — {self.title}"


class Enrollment(models.Model):
    student    = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='enrollments',
        limit_choices_to={'role': 'student'},
    )
    course     = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')

    def __str__(self):
        return f"{self.student.username} → {self.course.title}"

    @property
    def progress(self):
        total = self.course.lessons.count()
        if total == 0:
            return 0
        done = LessonProgress.objects.filter(
            enrollment=self, lesson__course=self.course, completed=True
        ).count()
        return round((done / total) * 100)


class LessonProgress(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lesson_progress')
    lesson     = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    completed  = models.BooleanField(default=False)
    watched_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('enrollment', 'lesson')

    def __str__(self):
        return f"{self.enrollment.student.username} — {self.lesson.title} ({'done' if self.completed else 'pending'})"


class CourseReview(models.Model):
    course     = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='reviews')
    student    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating     = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('course', 'student')

    def __str__(self):
        return f"{self.student.username} rated {self.course.title}: {self.rating}★"
