from django.core.management.base import BaseCommand
from nutrition.models import Food
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed the database with 10-20 diverse foods for testing'

    def handle(self, *args, **options):
        foods_data = [
            # Proteins
            {
                'name': 'Chicken Breast (cooked)',
                'calories_per_100g': Decimal('165.00'),
                'protein_per_100g': Decimal('31.00'),
                'carbs_per_100g': Decimal('0.00'),
                'fat_per_100g': Decimal('3.60'),
                'fiber_per_100g': Decimal('0.00'),
                'sugar_per_100g': Decimal('0.00'),
            },
            {
                'name': 'Salmon (cooked)',
                'calories_per_100g': Decimal('206.00'),
                'protein_per_100g': Decimal('22.00'),
                'carbs_per_100g': Decimal('0.00'),
                'fat_per_100g': Decimal('12.00'),
                'fiber_per_100g': Decimal('0.00'),
                'sugar_per_100g': Decimal('0.00'),
            },
            {
                'name': 'Eggs (whole, cooked)',
                'calories_per_100g': Decimal('155.00'),
                'protein_per_100g': Decimal('13.00'),
                'carbs_per_100g': Decimal('1.10'),
                'fat_per_100g': Decimal('11.00'),
                'fiber_per_100g': Decimal('0.00'),
                'sugar_per_100g': Decimal('1.10'),
            },
            {
                'name': 'Greek Yogurt (plain, non-fat)',
                'calories_per_100g': Decimal('59.00'),
                'protein_per_100g': Decimal('10.00'),
                'carbs_per_100g': Decimal('3.60'),
                'fat_per_100g': Decimal('0.40'),
                'fiber_per_100g': Decimal('0.00'),
                'sugar_per_100g': Decimal('3.60'),
            },
            {
                'name': 'Lean Ground Beef (cooked)',
                'calories_per_100g': Decimal('250.00'),
                'protein_per_100g': Decimal('26.00'),
                'carbs_per_100g': Decimal('0.00'),
                'fat_per_100g': Decimal('17.00'),
                'fiber_per_100g': Decimal('0.00'),
                'sugar_per_100g': Decimal('0.00'),
            },
            
            # Carbohydrates
            {
                'name': 'Brown Rice (cooked)',
                'calories_per_100g': Decimal('111.00'),
                'protein_per_100g': Decimal('2.60'),
                'carbs_per_100g': Decimal('23.00'),
                'fat_per_100g': Decimal('0.90'),
                'fiber_per_100g': Decimal('1.80'),
                'sugar_per_100g': Decimal('0.40'),
            },
            {
                'name': 'Quinoa (cooked)',
                'calories_per_100g': Decimal('120.00'),
                'protein_per_100g': Decimal('4.40'),
                'carbs_per_100g': Decimal('22.00'),
                'fat_per_100g': Decimal('1.90'),
                'fiber_per_100g': Decimal('2.80'),
                'sugar_per_100g': Decimal('0.87'),
            },
            {
                'name': 'Sweet Potato (baked)',
                'calories_per_100g': Decimal('90.00'),
                'protein_per_100g': Decimal('2.00'),
                'carbs_per_100g': Decimal('21.00'),
                'fat_per_100g': Decimal('0.15'),
                'fiber_per_100g': Decimal('3.30'),
                'sugar_per_100g': Decimal('6.50'),
            },
            {
                'name': 'Whole Wheat Pasta (cooked)',
                'calories_per_100g': Decimal('124.00'),
                'protein_per_100g': Decimal('5.00'),
                'carbs_per_100g': Decimal('25.00'),
                'fat_per_100g': Decimal('1.10'),
                'fiber_per_100g': Decimal('3.20'),
                'sugar_per_100g': Decimal('0.56'),
            },
            {
                'name': 'Oats (dry)',
                'calories_per_100g': Decimal('389.00'),
                'protein_per_100g': Decimal('16.90'),
                'carbs_per_100g': Decimal('66.30'),
                'fat_per_100g': Decimal('6.90'),
                'fiber_per_100g': Decimal('10.60'),
                'sugar_per_100g': Decimal('0.99'),
            },
            
            # Vegetables
            {
                'name': 'Broccoli (raw)',
                'calories_per_100g': Decimal('34.00'),
                'protein_per_100g': Decimal('2.80'),
                'carbs_per_100g': Decimal('7.00'),
                'fat_per_100g': Decimal('0.40'),
                'fiber_per_100g': Decimal('2.60'),
                'sugar_per_100g': Decimal('1.50'),
            },
            {
                'name': 'Spinach (raw)',
                'calories_per_100g': Decimal('23.00'),
                'protein_per_100g': Decimal('2.90'),
                'carbs_per_100g': Decimal('3.60'),
                'fat_per_100g': Decimal('0.40'),
                'fiber_per_100g': Decimal('2.20'),
                'sugar_per_100g': Decimal('0.40'),
            },
            {
                'name': 'Carrots (raw)',
                'calories_per_100g': Decimal('41.00'),
                'protein_per_100g': Decimal('0.93'),
                'carbs_per_100g': Decimal('9.60'),
                'fat_per_100g': Decimal('0.24'),
                'fiber_per_100g': Decimal('2.80'),
                'sugar_per_100g': Decimal('4.70'),
            },
            
            # Fruits
            {
                'name': 'Banana',
                'calories_per_100g': Decimal('89.00'),
                'protein_per_100g': Decimal('1.10'),
                'carbs_per_100g': Decimal('23.00'),
                'fat_per_100g': Decimal('0.33'),
                'fiber_per_100g': Decimal('2.60'),
                'sugar_per_100g': Decimal('12.20'),
            },
            {
                'name': 'Apple',
                'calories_per_100g': Decimal('52.00'),
                'protein_per_100g': Decimal('0.26'),
                'carbs_per_100g': Decimal('14.00'),
                'fat_per_100g': Decimal('0.17'),
                'fiber_per_100g': Decimal('2.40'),
                'sugar_per_100g': Decimal('10.40'),
            },
            {
                'name': 'Blueberries',
                'calories_per_100g': Decimal('57.00'),
                'protein_per_100g': Decimal('0.74'),
                'carbs_per_100g': Decimal('14.50'),
                'fat_per_100g': Decimal('0.33'),
                'fiber_per_100g': Decimal('2.40'),
                'sugar_per_100g': Decimal('10.00'),
            },
            
            # Fats
            {
                'name': 'Avocado',
                'calories_per_100g': Decimal('160.00'),
                'protein_per_100g': Decimal('2.00'),
                'carbs_per_100g': Decimal('8.50'),
                'fat_per_100g': Decimal('14.70'),
                'fiber_per_100g': Decimal('6.70'),
                'sugar_per_100g': Decimal('0.70'),
            },
            {
                'name': 'Olive Oil',
                'calories_per_100g': Decimal('884.00'),
                'protein_per_100g': Decimal('0.00'),
                'carbs_per_100g': Decimal('0.00'),
                'fat_per_100g': Decimal('100.00'),
                'fiber_per_100g': None,
                'sugar_per_100g': None,
            },
            {
                'name': 'Almonds (raw)',
                'calories_per_100g': Decimal('579.00'),
                'protein_per_100g': Decimal('21.20'),
                'carbs_per_100g': Decimal('21.60'),
                'fat_per_100g': Decimal('49.90'),
                'fiber_per_100g': Decimal('12.50'),
                'sugar_per_100g': Decimal('4.40'),
            },
            
            # Other
            {
                'name': 'Black Beans (cooked)',
                'calories_per_100g': Decimal('132.00'),
                'protein_per_100g': Decimal('8.86'),
                'carbs_per_100g': Decimal('23.70'),
                'fat_per_100g': Decimal('0.54'),
                'fiber_per_100g': Decimal('8.70'),
                'sugar_per_100g': Decimal('0.32'),
            },
        ]

        created_count = 0
        updated_count = 0

        for food_data in foods_data:
            food, created = Food.objects.update_or_create(
                name=food_data['name'],
                defaults={
                    'calories_per_100g': food_data['calories_per_100g'],
                    'protein_per_100g': food_data['protein_per_100g'],
                    'carbs_per_100g': food_data['carbs_per_100g'],
                    'fat_per_100g': food_data['fat_per_100g'],
                    'fiber_per_100g': food_data.get('fiber_per_100g'),
                    'sugar_per_100g': food_data.get('sugar_per_100g'),
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created: {food.name}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated: {food.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully seeded foods! Created: {created_count}, Updated: {updated_count}'
            )
        )

