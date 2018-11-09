# Generated by Django 2.1.1 on 2018-11-05 13:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('article', '0003_tagcolor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tagcolor',
            name='rgb',
            field=models.CharField(max_length=7, validators=[django.core.validators.RegexValidator('^#[0-9A-F]{6}$')]),
        ),
    ]