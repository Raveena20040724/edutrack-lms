from django.urls import path
from . import views

urlpatterns = [
    # Assignments CRUD
    path('',                                        views.AssignmentListView.as_view(),     name='assignment_list'),
    path('<int:pk>/',                               views.AssignmentDetailView.as_view(),   name='assignment_detail'),

    # Student: submit
    path('<int:assignment_id>/submit/',             views.SubmitAssignmentView.as_view(),   name='submit_assignment'),
    path('<int:assignment_id>/submissions/',        views.SubmissionListView.as_view(),     name='submission_list'),

    # Student: my submissions & results
    path('my-submissions/',                         views.MySubmissionsView.as_view(),      name='my_submissions'),
    path('results/',                                views.StudentResultsView.as_view(),     name='student_results'),

    # Trainer: grade & analytics
    path('submissions/<int:submission_id>/grade/',  views.GradeSubmissionView.as_view(),    name='grade_submission'),
    path('submissions/<int:pk>/',                   views.SubmissionDetailView.as_view(),   name='submission_detail'),
    path('analytics/',                              views.TrainerAnalyticsView.as_view(),   name='trainer_analytics'),

    # Admin
    path('admin/analytics/',                        views.AdminAnalyticsView.as_view(),     name='admin_analytics'),
]
