# Generated by Django 4.1.7 on 2023-05-04 01:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='systemdetectedengagement',
            name='frame_data',
            field=models.BinaryField(blank=True, default=b'', null=True),
        ),
    ]