import os
from setuptools import setup, find_packages

requires = [
    'pyramid',
    'waitress',
    'pyramid_mako',
]

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, '../README.md')) as f:
    README = f.read()
with open(os.path.join(here, '../CHANGES.md')) as f:
    CHANGES = f.read()

setup(
    name='display-trigger',
    version='0.0',
    description='display-trigger',
    long_description="\n\n".join((README, CHANGES)),
    classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
    ],
    author='',
    author_email='',
    url='',
    keywords='web pyramid pylons',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    tests_require=requires,
    test_suite="displaytrigger",
    entry_points="""\
    [paste.app_factory]
    main = displaytrigger:main
    """,
)
