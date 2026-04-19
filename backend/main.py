from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from lhz_core import create_piece_from_url

app = FastAPI()


class CreatePieceRequest(BaseModel):
    character_url: str


class CreatePieceResponse(BaseModel):
    piece: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/create-piece", response_model=CreatePieceResponse)
def create_piece(req: CreatePieceRequest):
    try:
        piece = create_piece_from_url(req.character_url)
        return CreatePieceResponse(piece=piece)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal Server Error")