import unittest

from lib.encadrement import epoque_bounds

CASES = [
    ("avant 1946", ("", "1945")),
    ("Avant 1946", ("", "1945")),
    ("1946-1970", ("1946", "1970")),
    ("Apres 1990", ("1991", "")),
    ("après 2005", ("2006", "")),
]


class EpoqueBoundsTest(unittest.TestCase):
    def test_bounds(self) -> None:
        for label, expected in CASES:
            with self.subTest(label=label):
                self.assertEqual(epoque_bounds(label), expected)


if __name__ == "__main__":
    unittest.main()
