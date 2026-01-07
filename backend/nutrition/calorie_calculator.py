"""
Calorie calculation service using BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure).

Uses the Mifflin-St Jeor equation for BMR calculation, which is considered the most accurate.
"""

from decimal import Decimal


class CalorieCalculator:
    """
    Calculate BMR, TDEE, and calorie targets based on user profile and weight goals.
    """
    
    # Activity level multipliers for TDEE calculation
    ACTIVITY_MULTIPLIERS = {
        'sedentary': Decimal('1.2'),           # Little to no exercise
        'lightly_active': Decimal('1.375'),    # Light exercise 1-3 days/week
        'moderately_active': Decimal('1.55'),   # Moderate exercise 3-5 days/week
        'very_active': Decimal('1.725'),       # Heavy exercise 6-7 days/week
        'extra_active': Decimal('1.9'),        # Very heavy exercise, physical job
    }
    
    # Calories per pound of body weight (for weight change calculations)
    CALORIES_PER_POUND = Decimal('3500')
    
    @staticmethod
    def calculate_bmr(weight_lbs, height_inches, age, gender):
        """
        Calculate Basal Metabolic Rate using Mifflin-St Jeor equation.
        
        BMR (men) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
        BMR (women) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
        
        Args:
            weight_lbs: Weight in pounds
            height_inches: Height in inches
            age: Age in years
            gender: 'male', 'female', or 'other' (uses male formula for 'other')
        
        Returns:
            BMR in calories per day (Decimal)
        """
        # Convert to metric
        weight_kg = Decimal(str(weight_lbs)) * Decimal('0.453592')  # lbs to kg
        height_cm = Decimal(str(height_inches)) * Decimal('2.54')    # inches to cm
        age_decimal = Decimal(str(age))
        
        # Base BMR calculation
        bmr = (
            Decimal('10') * weight_kg +
            Decimal('6.25') * height_cm -
            Decimal('5') * age_decimal
        )
        
        # Add gender adjustment
        if gender == 'female':
            bmr -= Decimal('161')
        else:  # male or other
            bmr += Decimal('5')
        
        return bmr.quantize(Decimal('0.01'))
    
    @staticmethod
    def calculate_tdee(bmr, activity_level):
        """
        Calculate Total Daily Energy Expenditure (TDEE).
        
        TDEE = BMR × Activity Multiplier
        
        Args:
            bmr: Basal Metabolic Rate in calories
            activity_level: Activity level string
        
        Returns:
            TDEE in calories per day (Decimal)
        """
        multiplier = CalorieCalculator.ACTIVITY_MULTIPLIERS.get(
            activity_level, 
            Decimal('1.2')  # Default to sedentary
        )
        return (bmr * multiplier).quantize(Decimal('0.01'))
    
    @staticmethod
    def calculate_calorie_target(tdee, weight_goal_type, weight_change_per_week):
        """
        Calculate daily calorie target based on TDEE and weight goals.
        
        For weight loss: TDEE - (calories per pound × lbs per week / 7)
        For weight gain: TDEE + (calories per pound × lbs per week / 7)
        For maintenance: TDEE
        
        Args:
            tdee: Total Daily Energy Expenditure in calories
            weight_goal_type: 'lose', 'maintain', or 'gain'
            weight_change_per_week: Pounds to lose/gain per week (Decimal)
        
        Returns:
            Daily calorie target (int)
        """
        tdee_decimal = Decimal(str(tdee))
        change_per_week = Decimal(str(weight_change_per_week))
        
        if weight_goal_type == 'maintain':
            return int(tdee_decimal.quantize(Decimal('1'), rounding='ROUND_HALF_UP'))
        
        # Calculate daily calorie adjustment
        # 1 lb = 3500 calories, so per week = 3500 × lbs_per_week
        # Per day = (3500 × lbs_per_week) / 7
        weekly_calorie_adjustment = CalorieCalculator.CALORIES_PER_POUND * change_per_week
        daily_adjustment = weekly_calorie_adjustment / Decimal('7')
        
        if weight_goal_type == 'lose':
            calorie_target = tdee_decimal - daily_adjustment
        else:  # gain
            calorie_target = tdee_decimal + daily_adjustment
        
        # Ensure minimum safe calorie intake (1200 for women, 1500 for men)
        min_calories = Decimal('1200')
        calorie_target = max(calorie_target, min_calories)
        
        return int(calorie_target.quantize(Decimal('1'), rounding='ROUND_HALF_UP'))
    
    @staticmethod
    def calculate_all_targets(weight_lbs, height_inches, age, gender, activity_level, 
                              weight_goal_type='maintain', weight_change_per_week=Decimal('0.5')):
        """
        Calculate all calorie-related targets in one call.
        
        Args:
            weight_lbs: Current weight in pounds
            height_inches: Height in inches
            age: Age in years
            gender: 'male', 'female', or 'other'
            activity_level: Activity level string
            weight_goal_type: 'lose', 'maintain', or 'gain'
            weight_change_per_week: Pounds to lose/gain per week
        
        Returns:
            Dictionary with 'bmr', 'tdee', and 'calorie_target'
        """
        bmr = CalorieCalculator.calculate_bmr(weight_lbs, height_inches, age, gender)
        tdee = CalorieCalculator.calculate_tdee(bmr, activity_level)
        calorie_target = CalorieCalculator.calculate_calorie_target(
            tdee, weight_goal_type, weight_change_per_week
        )
        
        return {
            'bmr': float(bmr),
            'tdee': float(tdee),
            'calorie_target': calorie_target,
        }
    
    @staticmethod
    def calculate_macro_targets(calorie_target, protein_ratio=0.3, carb_ratio=0.40, fat_ratio=0.30):
        """
        Calculate macro targets based on calorie target and ratios.
        
        Default ratios:
        - Protein: 30% (4 calories per gram)
        - Carbs: 40% (4 calories per gram)
        - Fat: 30% (9 calories per gram)
        
        Args:
            calorie_target: Daily calorie target
            protein_ratio: Protein percentage (default 0.3)
            carb_ratio: Carb percentage (default 0.4)
            fat_ratio: Fat percentage (default 0.3)
        
        Returns:
            Dictionary with 'protein_target', 'carb_target', 'fat_target' in grams
        """
        calorie_decimal = Decimal(str(calorie_target))
        
        # Calculate calories for each macro
        protein_calories = calorie_decimal * Decimal(str(protein_ratio))
        carb_calories = calorie_decimal * Decimal(str(carb_ratio))
        fat_calories = calorie_decimal * Decimal(str(fat_ratio))
        
        # Convert to grams (protein and carbs: 4 cal/g, fat: 9 cal/g)
        protein_grams = (protein_calories / Decimal('4')).quantize(Decimal('0.01'))
        carb_grams = (carb_calories / Decimal('4')).quantize(Decimal('0.01'))
        fat_grams = (fat_calories / Decimal('9')).quantize(Decimal('0.01'))
        
        return {
            'protein_target': float(protein_grams),
            'carb_target': float(carb_grams),
            'fat_target': float(fat_grams),
        }

