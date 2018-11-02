# Generated by Django 2.1.1 on 2018-11-02 06:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Interest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('createdDate', models.DateTimeField(verbose_name=datetime.datetime.now)),
                ('photoURL', models.CharField(blank=True, max_length=140, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='InterestTag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
            ],
        ),
        migrations.AddField(
            model_name='interest',
            name='tags',
            field=models.ManyToManyField(related_name='interests', to='interest.InterestTag'),
        ),
    ]
