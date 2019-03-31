from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    url('^api/user/$', views.UserList.as_view()),
    url('^api/user/new/$', views.CreateUser.as_view()),
    url('^api/coin/$', views.CoinList.as_view()),
    url('^api/coin/predict/$', views.GetCoinPrediciton.as_view()),
    url('^api/generated_portfolio/$', views.GetGeneratedPortfolio.as_view()),
    url('^api/generated_portfolio/new/$', views.CreateGeneratedPortfolio.as_view()),
    url('^api/generated_portfolio/(?P<username>.+)/$', views.GeneratedPortfolioList.as_view()),
    url('^api/coin/generated_portfolio/(?P<portfolio>.+)/$', views.CoinsForGeneratedPortoflio.as_view()),
    url('^api/coin/generated_portfolio/$', views.CreateCoinsInGeneratedPortoflio.as_view()),
    url('^api/coin/user_portfolio/(?P<portfolio>.+)/$', views.CoinsForUserPortoflio.as_view()),
    url('^api/portfolio/active/(?P<username>.+)/$', views.GeneratedPortfolioList.as_view())
]