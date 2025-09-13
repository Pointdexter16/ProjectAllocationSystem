from sqlalchemy import create_engine
from sqlalchemy.orm import  sessionmaker
from fastapi import HTTPException, status

# 1. Define the database connection
# This example uses SQLite, which is a file-based database and doesn't require a separate server.
# For a MySQL database, you would use a connection string like:
# 'mysql+pymysql://user:password@host/company_db'
engine = create_engine('mysql+pymysql://root:demo@localhost/companydb')



Session = sessionmaker(bind=engine)
session = Session()

def get_db():
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def commit_to_db(db,instance):
    try:
        db.add(instance)
        db.commit()
        db.refresh(instance)
        return instance
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Database operation failed: {e}"
        )