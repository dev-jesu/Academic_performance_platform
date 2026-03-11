def calculate_grade(percentage: float):

    if percentage == 100:
        return "O"

    elif percentage >= 90:
        return "A+"

    elif percentage >= 80:
        return "A"

    elif percentage >= 70:
        return "B+"

    elif percentage >= 60:
        return "B"

    elif percentage >= 50:
        return "C"

    else:
        return "F"