import unittest

from lib.logement import parse_door, parse_floor

CASES = [
    ("Etage 2; Porte 3", "0", "2", "3"),
    ("Appt 502", "0", "", "502"),
    ("Etage 1", "0", "1", ""),
    ("Esc. E; Etage 4; Porte 44", "0", "4", "44"),
    ("2ème étage", "0", "2", ""),
    ("Bat. F 021L0123", "0", "", ""),
    ("", "2", "2", ""),
    ("Bât A; 2ème Etg", "0", "2", ""),
    ("Etage 1 porte droite sur rue", "0", "1", ""),
    ("bât. Le Fragonnard - 3eme ETG - APPT 37", "0", "3", "37"),
    ("Studio", "0", "", ""),
    ("RDC", "0", "0", ""),
    ("Etage RDC; Porte 6", "0", "0", "6"),
    ("Etage 3, Porte 36+Cave 9", "0", "3", "36"),
    ("Etage : 5", "0", "5", ""),
    ("13", "1", "1", "13"),
    ("3° Etage", "0", "3", ""),
    ("Etage : 2eme", "0", "2", ""),
    ("RDC - Apt 104", "0", "0", "104"),
    ("Appartement 8 étage", "0", "8", ""),
    ("Appt 202A", "0", "", "202A"),
    ("Bat. N/A; Etage 03; Porte 30", "0", "3", "30"),
    ("Appartement au 3ème étage", "0", "3", ""),
    ("Bat. L'Amandier; Porte 2.5; Etage 2", "0", "2", "2"),
    ("5e étage, Appt n°27", "0", "5", "27"),
    ("Couloir de gauche,1ère porte gauche", "0", "", ""),
    ("1-Bâtiment CLAIRES-15-Appartement 15 - R+3- Lot 1- Code 2018", "0", "3", "15"),
    ("2-Bâtiment n° ENTAILLES-21-Appartement 21 - R+ 4- Lot 1- Code 2018", "0", "4", "21"),
    ("1-Bâtiment n°6/8-2-APPT N°74", "0", "", "74"),
    ("Porte n° 31", "0", "", "31"),
    ("SS15H002 APP 12", "0", "", "12"),
    ("1-APPARTEMENT-1-LogZone", "0", "", ""),
]


class LogementParserTest(unittest.TestCase):
    def test_samples(self) -> None:
        for complement, numero, floor, door in CASES:
            with self.subTest(complement=complement):
                self.assertEqual(parse_floor(complement, numero), floor)
                self.assertEqual(parse_door(complement), door)


if __name__ == "__main__":
    unittest.main()
