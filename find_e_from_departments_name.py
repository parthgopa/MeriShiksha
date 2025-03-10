class find_e_from_engineering_departments_name:
    def __init__(self):     # CONSTRUCTOR - AUTOMATICALLY CALLED
        self.name = ["Mechanical Engineering", "Civil Engineering"]
        self.e_names = []
        self.find_e()

    def find_e(self):      # METHODS -  CALL KARVI PADE
        for department in self.name:
            for word in department.upper():
                if "E"==word:
                  self.e_names.append('E')

if __name__ == "__main__":
    obj = find_e_from_engineering_departments_name()
    print(len(obj.e_names))