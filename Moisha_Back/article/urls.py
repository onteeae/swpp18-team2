from django.urls import path
from article import views

urlpatterns = [
    path('', views.getArticlesByUser),
    path('tags/', views.getArticlesByUserByTag),
    path('create/', views.createArticle),
    path('<int:pk>/', views.getArticleById),
    path('<int:pk>/edit/', views.editArticle),
    path('<int:pk>/delete/', views.deleteArticle),
    path('<int:pk>/comment/', views.getCommentsByArticle),
    path('interest/<int:pk>/', views.getArticlesByInterest),
    path('interest/<int:pk>/tags/', views.getArticlesByInterestByTag),
    path('tag/', views.getArticleTags)
]
