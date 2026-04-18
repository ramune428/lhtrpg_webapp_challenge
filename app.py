import streamlit as st
from lhz_core import create_piece_from_url


st.title("LHTRPG 駒生成")

if "piece" not in st.session_state:
    st.session_state["piece"] = ""

if "character_url" not in st.session_state:
    st.session_state["character_url"] = ""

with st.form(key="character_form"):
    character_url = st.text_input(
        "キャラクターURL",
        value=st.session_state["character_url"],
    )

    col1, col2 = st.columns([4, 1])
    with col1:
        action_btn_1 = st.form_submit_button("コマンドを生成する")
    with col2:
        action_btn_2 = st.form_submit_button("クリア")

    if action_btn_1:
        st.session_state["character_url"] = character_url
        try:
            st.session_state["piece"] = create_piece_from_url(character_url)
        except ValueError as e:
            st.session_state["piece"] = str(e)

    if action_btn_2:
        st.session_state["piece"] = ""
        st.session_state["character_url"] = ""

st.caption("生成結果")
st.code(
    st.session_state["piece"],
    language=None,
    line_numbers=False,
    wrap_lines=True,
)