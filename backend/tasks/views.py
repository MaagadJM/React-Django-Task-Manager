from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer

# GET all tasks / POST a new task
class TaskListCreateView(generics.ListCreateAPIView):
    queryset         = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

# GET / PATCH / DELETE a single task
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset         = Task.objects.all()
    serializer_class = TaskSerializer
