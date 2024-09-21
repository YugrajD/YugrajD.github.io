from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models import Post, GameLog, ValGameLog
from .serializers import PostSerializer, GameLogSerializer, ValGameLogSerializer, AnalysisResultSerializer
from .forms import GameLogForm
import pandas as pd
from django.http import JsonResponse, HttpResponse
import matplotlib.pyplot as plt
import io
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import logging
import matplotlib
matplotlib.use('Agg')

class PostViewset(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    confirm_password = request.data.get('confirmPassword')
    email = request.data.get('email')

    if password != confirm_password:
        return Response({'error': 'Passwords do not match!'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists!'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User successfully registered!'}, status=status.HTTP_201_CREATED)

class GameLogViewSet(viewsets.ModelViewSet):
    queryset = GameLog.objects.all()
    serializer_class = GameLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return GameLog.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Print errors to the console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class ValGameLogViewSet(viewsets.ModelViewSet):
    queryset = ValGameLog.objects.all()
    serializer_class = ValGameLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ValGameLog.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Print errors to the console
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        



@api_view(['GET'])
def analyze_game_logs(request):
    logger = logging.getLogger(__name__)
    user = request.user
    logger.debug(f"User: {user}, User ID: {user.id}")

    try:
        game_logs = GameLog.objects.filter(user=user).values()
        game_logs_list = list(game_logs)

        logger.debug(f"Game Logs: {game_logs_list}")

        if not game_logs_list:
            logger.info("No game logs found in the database for the user.")
            return Response({'message': 'No game logs found'}, status=404)

        df = pd.DataFrame(game_logs_list)
        logger.debug(f"DataFrame:\n{df}")

        if df.empty:
            logger.info("DataFrame is empty after conversion.")
            return Response({'message': 'No game logs found'}, status=404)

        # Example analysis: Calculate Win/Loss ratio
        win_loss_ratio = df['result'].value_counts(normalize=True).to_dict()
        logger.debug(f"Win/Loss Ratio: {win_loss_ratio}")

        # Example analysis: Average stats
        numeric_columns = ['eliminations', 'assists', 'deaths', 'damage', 'healing', 'mitigation']
        average_stats = df[numeric_columns].mean().to_dict()
        logger.debug(f"Average Stats: {average_stats}")

        # Example analysis: Performance trends over time
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)
        monthly_performance_trends = df[numeric_columns].resample('M').mean().to_dict(orient='list')
        logger.debug(f"Performance Trends: {monthly_performance_trends}")

        analysis_result = {
            'win_loss_ratio': win_loss_ratio,
            'average_stats': average_stats,
            'performance_trends': monthly_performance_trends,
            'logs': game_logs_list
        }

        logger.debug(f"Analysis Result: {analysis_result}")
        
        return JsonResponse(analysis_result, safe=False)
    except Exception as e:
        logger.error(f"Error analyzing game logs: {e}", exc_info=True)
        return Response({'message': 'Error analyzing game logs'}, status=500)
    

@api_view(['GET'])
def val_analyze_game_logs(request):
    logger = logging.getLogger(__name__)
    user = request.user
    logger.debug(f"User: {user}, User ID: {user.id}")

    try:
        val_game_logs = ValGameLog.objects.filter(user=user).values()
        val_game_logs_list = list(val_game_logs)

        logger.debug(f"Game Logs: {val_game_logs_list}")

        if not val_game_logs_list:
            logger.info("No game logs found in the database for the user.")
            return Response({'message': 'No game logs found'}, status=404)

        df = pd.DataFrame(val_game_logs_list)
        logger.debug(f"DataFrame:\n{df}")

        if df.empty:
            logger.info("DataFrame is empty after conversion.")
            return Response({'message': 'No game logs found'}, status=404)

        # Example analysis: Calculate Win/Loss ratio
        val_win_loss_ratio = df['valResult'].value_counts(normalize=True).to_dict()
        logger.debug(f"Win/Loss Ratio: {val_win_loss_ratio}")

        # Example analysis: Average stats
        val_numeric_columns = ['kills', 'assist', 'death', 'econRating', 'plants', 'defuses', 'combatScore']
        val_average_stats = df[val_numeric_columns].mean().to_dict()
        logger.debug(f"Average Stats: {val_average_stats}")

        # Example analysis: Performance trends over time
        df['valDate'] = pd.to_datetime(df['valDate'])
        df.set_index('valDate', inplace=True)
        val_monthly_performance_trends = df[val_numeric_columns].resample('M').mean().to_dict(orient='list')
        logger.debug(f"Performance Trends: {val_monthly_performance_trends}")

        val_analysis_result = {
            'win_loss_ratio': val_win_loss_ratio,
            'average_stats': val_average_stats,
            'performance_trends': val_monthly_performance_trends,
            'logs': val_game_logs_list
        }

        logger.debug(f"Analysis Result: {val_analysis_result}")
        
        return JsonResponse(val_analysis_result, safe=False)
    except Exception as e:
        logger.error(f"Error analyzing game logs: {e}", exc_info=True)
        return Response({'message': 'Error analyzing game logs'}, status=500)

@api_view(['GET'])
def plot_performance_trend(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'message': 'User is not authenticated'}, status=401)

    game_logs = GameLog.objects.filter(user=user).values()
    df = pd.DataFrame(game_logs)

    if df.empty:
        return JsonResponse({'message': 'No game logs found'})

    df['date'] = pd.to_datetime(df['date'])
    
    # Exclude non-numeric columns
    numeric_columns = df.select_dtypes(include='number').columns
    df_numeric = df[numeric_columns].copy()
    df_numeric['date'] = df['date']  # Retain the date column for grouping

    monthly_trends = df_numeric.groupby(df['date'].dt.to_period('M')).mean()

    fig, ax = plt.subplots()
    monthly_trends.plot(ax=ax)

    buf = io.BytesIO()
    canvas = FigureCanvas(fig)
    canvas.print_png(buf)
    response = HttpResponse(buf.getvalue(), content_type='image/png')
    response['Content-Length'] = str(len(response.content))

    plt.close(fig)  # Close the figure after saving it to the buffer

    return response