from data_analytics.preprocessing.utils import *

def test_normalise_time():
    "Tests for the normalise_time util function"

    # Times with invalid hours should be changed
    assert normalise_time("24:00:00") == "00:00:00"
    assert normalise_time("26:50:24") == "02:50:24"
    assert normalise_time("27:30:59") == "03:30:59"

    # Times with valid hours should not be changed
    assert normalise_time("04:00:00") == "04:00:00"
    assert normalise_time("23:59:59") == "23:59:59"
    assert normalise_time("13:24:59") == "13:24:59"

def test_parse_stop_num():
    "Tests for the parse_stop_num util function"

    # Stop name contains number
    assert parse_stop_num("Parnell Square West, stop 2", "8220DB000002") == 2
    assert parse_stop_num("Cathal Brugha Street, Stop No. 286", "8220DB000286") == 286

    # Stop name doesn't contain number
    assert parse_stop_num("Cumberland Road", "8220DB007336") == 7336
    assert parse_stop_num("Hearse Road R126", "8240DB007040") == 7040
