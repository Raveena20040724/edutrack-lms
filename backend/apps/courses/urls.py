from django.urls import path
from . import views

urlpatterns = [
    # Course CRUD
    path('',                                    views.CourseListView.as_view(),         name='course_list'),
    path('<int:pk>/',                           views.CourseDetailView.as_view(),       name='course_detail'),

    # Lessons
    path('<int:course_id>/lessons/',            views.LessonListView.as_view(),         name='lesson_list'),
    path('<int:course_id>/lessons/<int:pk>/',   views.LessonDetailView.as_view(),       name='lesson_detail'),

    # Lesson completion
    path('<int:course_id>/lessons/<int:lesson_id>/complete/', views.MarkLessonDoneView.as_view(), name='lesson_complete'),
    path('<int:course_id>/progress/',           views.LessonProgressListView.as_view(), name='lesson_progress'),

    # Enrollment
    path('<int:course_id>/enroll/',             views.EnrollView.as_view(),             name='enroll'),
    path('<int:course_id>/unenroll/',           views.UnenrollView.as_view(),           name='unenroll'),
    path('<int:course_id>/students/',           views.CourseStudentsView.as_view(),     name='course_students'),

    # Reviews
    path('<int:course_id>/reviews/',            views.CourseReviewView.as_view(),       name='course_reviews'),

    # Student
    path('my-enrollments/',                     views.MyEnrollmentsView.as_view(),      name='my_enrollments'),

    # Trainer
    path('my-courses/',                         views.TrainerCoursesView.as_view(),     name='my_courses'),

    # Admin
    path('admin/all/',                          views.AdminCourseListView.as_view(),    name='admin_all_courses'),
]
