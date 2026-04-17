import streamlit as st
from lhz_core import create_piece_from_url


st.title("LHTRPG 駒生成")

piece = ""

with st.form(key="character_form"):
    character_url = st.text_input("キャラクターURL")

    action_btn_1 = st.form_submit_button("コマンドを生成する")
    if action_btn_1:
        try:
            piece = create_piece_from_url(character_url)
        except ValueError as e:
            piece = str(e)

    text_area_1 = st.text_area(
        "生成結果",
        value=piece,
        height=250,
    )

    col1, col2, col3, col4, col5 = st.columns(5)
    with col5:
        action_btn_2 = st.form_submit_button("クリア")

    if action_btn_2:
        piece = ""