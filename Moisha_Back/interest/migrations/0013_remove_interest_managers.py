# Generated by Django 2.1.2 on 2018-12-08 20:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interest', '0012_interest_managers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='interest',
            name='managers',
        ),
    ]
