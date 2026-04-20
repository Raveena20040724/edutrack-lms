"""
Management command to seed the database with sample data.
Run: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.courses.models import Course, Lesson, Enrollment
from apps.assignments.models import Assignment
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with sample EduTrack data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # ── Users ──────────────────────────────────────────────────────────────
        admin = self._create_user('admin',   'admin@edu.com',   'Admin',   'User',    'admin',   'Admin123!')
        trainer = self._create_user('maria', 'maria@edu.com',   'Maria',   'Chen',    'trainer', 'Trainer123!')
        student = self._create_user('alex',  'alex@edu.com',    'Alex',    'Johnson', 'student', 'Student123!')
        student2 = self._create_user('sam',  'sam@edu.com',     'Sam',     'Rivera',  'student', 'Student123!')
        student3 = self._create_user('priya','priya@edu.com',   'Priya',   'Patel',   'student', 'Student123!')

        # ── Courses ────────────────────────────────────────────────────────────
        c1 = self._create_course(
            trainer, '🎨', 'UI/UX Design Masterclass',
            'Master Figma, user research, and modern design systems.',
            'design', '12 weeks'
        )
        c2 = self._create_course(
            trainer, '💻', 'Full Stack Development',
            'React, Node.js, PostgreSQL — end to end.',
            'development', '16 weeks'
        )
        c3 = self._create_course(
            trainer, '📊', 'Data Science Fundamentals',
            'Python, pandas, and machine learning basics.',
            'data', '10 weeks'
        )

        # ── Lessons ────────────────────────────────────────────────────────────
        lessons_c1 = [
            ('Introduction to UX',      '18 min', 1),
            ('Wireframing Techniques',  '24 min', 2),
            ('Color Theory',            '20 min', 3),
            ('Advanced Grid Layouts',   '31 min', 4),
            ('Prototyping in Figma',    '28 min', 5),
        ]
        lessons_c2 = [
            ('React Fundamentals',  '35 min', 1),
            ('State Management',    '29 min', 2),
            ('Node.js & Express',   '40 min', 3),
        ]

        for title, duration, order in lessons_c1:
            Lesson.objects.get_or_create(
                course=c1, title=title,
                defaults={'duration': duration, 'order': order}
            )

        for title, duration, order in lessons_c2:
            Lesson.objects.get_or_create(
                course=c2, title=title,
                defaults={'duration': duration, 'order': order}
            )

        # ── Enrollments ────────────────────────────────────────────────────────
        for s in [student, student2, student3]:
            Enrollment.objects.get_or_create(student=s, course=c1)
        for s in [student, student2]:
            Enrollment.objects.get_or_create(student=s, course=c2)

        # ── Assignments ────────────────────────────────────────────────────────
        a1, _ = Assignment.objects.get_or_create(
            course=c1, title='Wireframe Submission',
            defaults={
                'instructions': 'Create a wireframe for a mobile app using Figma.',
                'due_date': date.today() - timedelta(days=10),
                'max_score': 100,
                'created_by': trainer,
            }
        )
        a2, _ = Assignment.objects.get_or_create(
            course=c1, title='Color Palette Project',
            defaults={
                'instructions': 'Design a color palette for a brand.',
                'due_date': date.today() + timedelta(days=5),
                'max_score': 100,
                'created_by': trainer,
            }
        )
        a3, _ = Assignment.objects.get_or_create(
            course=c2, title='React Hooks Deep Dive',
            defaults={
                'instructions': 'Build a custom hook and demonstrate its usage.',
                'due_date': date.today() + timedelta(days=10),
                'max_score': 100,
                'created_by': trainer,
            }
        )

        self.stdout.write(self.style.SUCCESS('✅ Database seeded successfully!'))
        self.stdout.write('')
        self.stdout.write('Login credentials:')
        self.stdout.write('  Admin:   admin   / Admin123!')
        self.stdout.write('  Trainer: maria   / Trainer123!')
        self.stdout.write('  Student: alex    / Student123!')

    def _create_user(self, username, email, first, last, role, password):
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email, 'first_name': first, 'last_name': last, 'role': role,
            }
        )
        if created:
            user.set_password(password)
            user.save()
            self.stdout.write(f'  Created {role}: {username}')
        return user

    def _create_course(self, instructor, icon, title, description, category, duration):
        course, created = Course.objects.get_or_create(
            title=title,
            defaults={
                'icon': icon, 'description': description,
                'category': category, 'duration': duration,
                'instructor': instructor,
            }
        )
        if created:
            self.stdout.write(f'  Created course: {title}')
        return course
