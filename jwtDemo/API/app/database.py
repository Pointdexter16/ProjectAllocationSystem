from sqlalchemy import create_engine
from sqlalchemy.orm import  sessionmaker

# 1. Define the database connection
# This example uses SQLite, which is a file-based database and doesn't require a separate server.
# For a MySQL database, you would use a connection string like:
# 'mysql+pymysql://user:password@host/company_db'
engine = create_engine('mysql+pymysql://root:demo@localhost/company_db')



Session = sessionmaker(bind=engine)
session = Session()

def get_db():
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()