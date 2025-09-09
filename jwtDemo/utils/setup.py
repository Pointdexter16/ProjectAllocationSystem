# Setup database
engine = create_engine("sqlite:///:memory:", echo=True)  # echo=True shows SQL logs
SessionLocal = sessionmaker(bind=engine)

# Create tables
Base.metadata.create_all(engine)

# Get session
session = SessionLocal()
