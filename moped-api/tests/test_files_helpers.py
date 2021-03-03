import unittest


from files.helpers import (
    get_file_extension,
    get_file_name,
    generate_clean_filename,
    is_valid_unique_id,
    get_current_datetime,
    filename_timestamp,
    generate_random_hash,
    strip_non_alpha,
    strip_non_common,
    strip_non_numeric,
    is_valid_number,
    is_valid_filename,
)


class TestFilesHelpers(unittest.TestCase):

    def test_strip_non_numeric(self):
        assert strip_non_numeric(None) == ""
        assert strip_non_numeric(1234) == ""
        assert strip_non_numeric(False) == ""
        assert strip_non_numeric("     ") == ""
        assert strip_non_numeric("\n") == ""
        assert strip_non_numeric("123456789") == "123456789"
        assert strip_non_numeric("0") == "0"

    def test_strip_non_alpha(self):
        assert strip_non_alpha(None) == ""
        assert strip_non_alpha(1234) == ""
        assert strip_non_alpha(False) == ""
        assert strip_non_alpha("@#$%^&*(") == ""
        assert strip_non_alpha("     ") == ""
        assert strip_non_alpha("123456789") == ""
        assert strip_non_alpha("\n") == ""

    def test_strip_non_common(self):
        assert strip_non_common(None) == ""
        assert strip_non_common("      ") == ""
        assert strip_non_common("hello()world") == "helloworld"
        assert strip_non_common("\n") == ""
        assert strip_non_common("crazy6^filE!@#$%T^Y&U*I<>???") == "crazy6filetyui"
        assert strip_non_common("'<($-Hello_World-$)>.png") == "-hello_world-png"

    def test_get_file_name(self):
        assert get_file_name(None) is None
        assert get_file_name("noext") is None
        assert get_file_name("n1230098123091209812039812308.png") == "n1230098123091209812039812308"

    def test_get_file_extension(self):
        assert get_file_extension(None) is None
        assert get_file_extension("") is None
        assert get_file_extension("noext") is None
        assert get_file_extension("           ") is None
        assert get_file_extension("1.^^^") is None
        assert get_file_extension("1.   ") is None
        assert get_file_extension(".   ") is None

        assert get_file_extension("a675ffad8f7df7d217e7028b342e0b38e2f2996ab0463645e24021ec366f873b2a.pdf") == "pdf"
        assert get_file_extension("crazy6^filE!@#$%T^Y&U*I<>???.mov.tar.gz") == "gz"
        assert get_file_extension("filename.png") == "png"
        assert get_file_extension("    .png") == "png"
        assert get_file_extension(".pdf") == "pdf"



    def test_is_valid_unique_id(self):
        assert is_valid_unique_id(generate_random_hash())

    def test_generate_clean_filename(self):
        self.assertRaises(Exception, generate_clean_filename, None)
        self.assertRaises(Exception, generate_clean_filename, "")
        self.assertRaises(Exception, generate_clean_filename, ".png")
        self.assertRaises(Exception, generate_clean_filename, "naathing")
        self.assertRaises(Exception, generate_clean_filename, "naathing.")

        assert generate_clean_filename("crazy6^filE!@#$%T^Y&U*I<>???.mov.tar.gz").endswith("crazy6filetyuimovtar.gz")

    def test_is_valid_number(self):
        assert is_valid_number(123) is False
        assert is_valid_number(None) is False
        assert is_valid_number("") is False
        assert is_valid_number("ABC") is False
        assert is_valid_number("123")

    def test_is_valid_filename(self):
        assert is_valid_filename(123) is False
        assert is_valid_filename("123") is False
        assert is_valid_filename(None) is False
        assert is_valid_filename("None") is False
        assert is_valid_filename({}) is False
        assert is_valid_filename(".png") is False
        assert is_valid_filename(".") is False
        assert is_valid_filename("file.") is False

