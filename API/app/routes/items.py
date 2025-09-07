# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from .. import models, schemas, database

# router = APIRouter(
#     prefix="/items",
#     tags=["items"]
# )

# @router.post("/", response_model=schemas.Item)
# def create_item(item: schemas.ItemCreate, db: Session = Depends(database.get_db)):
#     db_item = models.Item(name=item.name, description=item.description)
#     db.add(db_item)
#     db.commit()
#     db.refresh(db_item)
#     return db_item

# @router.get("/{item_id}", response_model=schemas.Item)
# def read_item(item_id: int, db: Session = Depends(database.get_db)):
#     db_item = db.query(models.Item).filter(models.Item.id == item_id).first()
#     if not db_item:
#         raise HTTPException(status_code=404, detail="Item not found")
#     return db_item
