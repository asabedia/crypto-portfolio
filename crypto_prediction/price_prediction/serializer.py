from rest_framework import serializers
from price_prediction.models import User, GeneratedPortfolio, Coin, Coin_in_Generated_Portfolio

class UserSerializer (serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = '__all__'

class GeneratedPortfolioSerializer (serializers.ModelSerializer):
    class Meta: 
        model = GeneratedPortfolio
        fields = '__all__'

class CoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coin
        fields = '__all__'

class CoinInGeneratedPortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coin_in_Generated_Portfolio
        fields = '__all__'



