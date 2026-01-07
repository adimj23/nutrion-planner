# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nutrition', '0004_foodcategory_dietarypattern_food_categories_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='gender',
            field=models.CharField(choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')], default='male', help_text='Gender for BMR calculation', max_length=10),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='weight_goal_type',
            field=models.CharField(choices=[('lose', 'Lose Weight'), ('maintain', 'Maintain Weight'), ('gain', 'Gain Weight')], default='maintain', help_text='Weight goal: lose, maintain, or gain', max_length=10),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='goal_weight',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='Goal weight in lbs (optional if maintaining)', max_digits=5, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='weight_change_per_week',
            field=models.DecimalField(decimal_places=2, default=0.5, help_text='Pounds to lose/gain per week (typically 0.5-2 lbs)', max_digits=4),
        ),
    ]

