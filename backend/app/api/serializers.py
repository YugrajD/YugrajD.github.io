from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from ..models import Post, GameLog, ValGameLog

class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'body')

class GameLogSerializer(ModelSerializer):
    class Meta:
        model = GameLog
        fields = '__all__'
        read_only_fields = ('user',)

class ValGameLogSerializer(ModelSerializer):
    class Meta:
        model = ValGameLog
        fields = '__all__'
        read_only_fields = ('user',)


class AnalysisResultSerializer(serializers.Serializer):
    win_loss_ratio = serializers.DictField(child=serializers.FloatField())
    average_stats = serializers.DictField(child=serializers.FloatField())
    performance_trends = serializers.DictField(child=serializers.ListField(child=serializers.FloatField()))