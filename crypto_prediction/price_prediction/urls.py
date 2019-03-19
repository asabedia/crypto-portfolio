from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    url('^api/user/', views.UserList.as_view()),
    url('^api/coin/', views.CoinList.as_view()),
    url('^api/portfolio/(?P<username>.+)/$', views.GeneratedPortfolioList.as_view())
]