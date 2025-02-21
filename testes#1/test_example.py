import unittest

class CoolTests(unittest.TestCase):
    def setUp(self):
        self.cool_list = [1, 2, 3, 4, 5]
        self.cool_dict = {"name": "Tester", "level": 9000}
    
    def test_super_math(self):
        # Testing cool math operations
        self.assertEqual(2 ** 3, 8, "Power operation failed!")
        self.assertTrue(100 > 99, "Math comparison failed!")
        self.assertGreater(1000, 999)
    
    def test_awesome_strings(self):
        # Testing string operations
        cool_text = "Python is Awesome!"
        self.assertEqual(cool_text.lower(), "python is awesome!")
        self.assertTrue(cool_text.startswith("Python"))
        self.assertIn("Awesome", cool_text)
    
    def test_list_operations(self):
        # Testing list stuff
        self.assertIn(3, self.cool_list)
        self.cool_list.append(6)
        self.assertEqual(len(self.cool_list), 6)
        self.assertEqual(sum(self.cool_list), 21)
    
    def test_dictionary_magic(self):
        # Testing dictionary operations
        self.assertEqual(self.cool_dict["level"], 9000)
        self.cool_dict["power"] = "Maximum"
        self.assertIn("power", self.cool_dict)
        self.assertTrue(len(self.cool_dict) == 3)

if __name__ == '__main__':
    print("🚀 Starting Super Cool Tests! 🚀")
    unittest.main(verbosity=2)