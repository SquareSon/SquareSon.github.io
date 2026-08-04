# -*- coding: utf-8 -*-
from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = PROJECT_ROOT / "files" / "Zi-Fang-CV.pdf"
PROFILE_IMAGE = PROJECT_ROOT / "images" / "profile" / "zi-fang.png"

BLUE = colors.HexColor("#224B8D")
INK = colors.HexColor("#293038")
MUTED = colors.HexColor("#5F6870")
LINE = colors.HexColor("#D9DEE4")


def register_fonts() -> None:
    # 同一 CID 字体覆盖中英文、数字和常用符号，避免单独 CJK fallback 丢失拉丁字形。
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "name": ParagraphStyle(
            "Name",
            parent=base["Title"],
            fontName="STSong-Light",
            fontSize=22,
            leading=26,
            textColor=INK,
            spaceAfter=2,
        ),
        "tagline": ParagraphStyle(
            "Tagline",
            parent=base["Normal"],
            fontName="STSong-Light",
            fontSize=10.5,
            leading=15,
            textColor=BLUE,
        ),
        "contact": ParagraphStyle(
            "Contact",
            parent=base["Normal"],
            fontName="STSong-Light",
            fontSize=8.6,
            leading=12,
            textColor=MUTED,
        ),
        "section": ParagraphStyle(
            "Section",
            parent=base["Heading2"],
            fontName="STSong-Light",
            fontSize=12.2,
            leading=15,
            textColor=BLUE,
            spaceBefore=8,
            spaceAfter=4,
        ),
        "heading": ParagraphStyle(
            "Heading",
            parent=base["Heading3"],
            fontName="STSong-Light",
            fontSize=9.7,
            leading=13,
            textColor=INK,
            spaceBefore=3,
            spaceAfter=1,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="STSong-Light",
            fontSize=8.7,
            leading=12.4,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=3,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="STSong-Light",
            fontSize=7.6,
            leading=10.5,
            textColor=MUTED,
            spaceAfter=2,
        ),
    }


def section(title: str, styles: dict[str, ParagraphStyle]) -> list[object]:
    return [Paragraph(title, styles["section"]), HRFlowable(width="100%", thickness=0.7, color=LINE, spaceAfter=4)]


def entry(title: str, period: str, body: str, styles: dict[str, ParagraphStyle]) -> KeepTogether:
    header = Table(
        [[Paragraph(title, styles["heading"]), Paragraph(period, styles["small"])]],
        colWidths=[139 * mm, 36 * mm],
    )
    header.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("ALIGN", (1, 0), (1, 0), "RIGHT")]))
    return KeepTogether([header, Paragraph(body, styles["body"])])


def header(zh: bool, styles: dict[str, ParagraphStyle]) -> Table:
    if zh:
        name = "方子 <font color='#6A737B' size='12'>Zi Fang</font>"
        tagline = "正在寻找算法 / 研究岗位 | 三维感知 | 具身智能 | 医疗机器人"
    else:
        name = "Zi Fang <font color='#6A737B' size='12'>方子</font>"
        tagline = "Seeking research / algorithm roles | 3D Perception | Embodied Intelligence | Medical Robotics"

    contact = (
        "<link href='mailto:fangzi508@sjtu.edu.cn'>fangzi508@sjtu.edu.cn</link>  |  "
        "<link href='https://scholar.google.com.hk/citations?user=bEc7mGgAAAAJ&amp;hl=en'>Google Scholar</link>  |  "
        "<link href='https://github.com/SquareSon'>GitHub</link>"
    )
    portrait = Image(str(PROFILE_IMAGE), width=27 * mm, height=27 * mm)
    text = [Paragraph(name, styles["name"]), Paragraph(tagline, styles["tagline"]), Spacer(1, 2 * mm), Paragraph(contact, styles["contact"])]
    table = Table([[text, portrait]], colWidths=[148 * mm, 27 * mm])
    table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("ALIGN", (1, 0), (1, 0), "RIGHT")]))
    return table


def build_chinese_page(styles: dict[str, ParagraphStyle]) -> list[object]:
    story: list[object] = [header(True, styles), Spacer(1, 3 * mm)]
    story += section("个人概况", styles)
    story.append(
        Paragraph(
            "上海交通大学机械工程博士研究生，预计 2026 年 12 月毕业。研究将多传感状态感知、可靠医学影像观测、连续三维表征与机器人导航串联起来，重点关注算法在标定、假体与物理原理样机中的系统级可验证性。",
            styles["body"],
        )
    )

    story += section("教育经历", styles)
    story.append(entry("上海交通大学 / 机械工程博士研究生", "2021.09 — 2026.12", "机械与动力工程学院（机器人研究所）。博士论文：甲状腺超声隐式三维重建与穿刺手术导航系统研究。", styles))
    story.append(entry("上海交通大学 / 机械工程学士", "2017.09 — 2021.06", "机械与动力工程学院试点班，院优秀毕业生。", styles))

    story += section("研究与项目脉络", styles)
    story.append(entry("多传感状态感知、故障诊断与寿命预测", "2021 — 2023", "从 IMU、电流和编码器时序中提取时域/频域特征，通过特征选择与降维构建紧凑状态表征，用于机器人故障分类和螺栓松动剩余寿命预测；相关系统用于大型航天器姿态调节 AGV 状态监控。", styles))
    story.append(entry("可靠超声观测与二维语义", "2024 — 2025", "面向自由手超声的接触质量、设备域差异和细小目标，研究有效观测筛选、成像响应规范化与甲状腺/血管/结节/针体的多语义分割，为三维重建提供可信观测。", styles))
    story.append(entry("物理神经场、多扫查配准与三维语义", "2023 — 至今", "将超声声学先验融入 NeRF/3DGS 连续表征，并将多扫查误差解耦为 sweep 级全局偏差、frame 级局部抖动与受力形变，联合优化位姿、表征与规范空间对齐。", styles))
    story.append(entry("导航坐标链、穿刺路径规划与机器人", "2025 — 至今", "通过双目近红外定位、探头/针尖标定、连续三维场与组织—器械语义构建导航坐标链；研究柔性针路径规划与小尺寸穿刺机器人，并以可重复假体和原理样机验证模块间坐标连接。", styles))

    story += section("代表性一作论文（以 Google Scholar 公开记录为准）", styles)
    papers = [
        "<b>Z. Fang</b>, et al. GLA-NeRF: Global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound. <i>Physics in Medicine &amp; Biology</i>, 2026.",
        "<b>Z. Fang</b>, et al. Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction. <i>IEEE Transactions on Instrumentation and Measurement</i>, 72, 2023.",
        "<b>Z. Fang</b>, et al. Fault Diagnosis Method for Industrial Robots based on Dimension Reduction and Random Forest. <i>M2VIP</i>, 2021.",
    ]
    story.extend(Paragraph(f"- {paper}", styles["body"]) for paper in papers)

    story += section("技术能力", styles)
    story.append(Paragraph("<b>三维感知：</b> NeRF / 3DGS、声学物理逆渲染、图像定位、多传感器位姿估计、可变形配准、三维语义。<br/><b>机器人与工程：</b> 路径规划、PyBullet / Isaac、PyQt / C#、STM32、CATIA / SolidWorks、Ansys / Adams。<br/><b>AI 开发：</b> PyTorch / Lightning、TensorFlow / JAX、Diffusion、VLA、RAG 与多模型应用。", styles["body"]))
    return story


def build_english_page(styles: dict[str, ParagraphStyle]) -> list[object]:
    story: list[object] = [header(False, styles), Spacer(1, 3 * mm)]
    story += section("PROFILE", styles)
    story.append(Paragraph("Ph.D. candidate in Mechanical Engineering at Shanghai Jiao Tong University, expecting to graduate in December 2026. My work connects multi-sensor condition perception, trustworthy medical-image observations, continuous 3D representations, and robot navigation. I focus on methods that remain testable through calibration, phantoms, and physical prototypes.", styles["body"]))

    story += section("EDUCATION", styles)
    story.append(entry("Shanghai Jiao Tong University / Ph.D. Candidate in Mechanical Engineering", "2021.09 — 2026.12", "Robotics Institute, School of Mechanical Engineering. Dissertation: implicit 3D thyroid-ultrasound reconstruction and puncture-navigation systems.", styles))
    story.append(entry("Shanghai Jiao Tong University / B.Eng. in Mechanical Engineering", "2017.09 — 2021.06", "Pilot honors program; Outstanding Graduate of the School.", styles))

    story += section("RESEARCH TRAJECTORY", styles)
    story.append(entry("Multi-sensor condition perception, diagnosis, and remaining-life prediction", "2021 — 2023", "Built compact condition representations from IMU, current, and encoder time series through time/frequency feature extraction, feature selection, and dimensionality reduction. Applied the representations to robot fault classification and remaining bolt-loosening life prediction in a production-oriented AGV monitoring system.", styles))
    story.append(entry("Trustworthy ultrasound observations and 2D semantics", "2024 — 2025", "Studied contact-quality screening, imaging-response canonicalization, and multi-class/multi-instance segmentation of thyroid, vessels, nodules, and needles to provide reliable observations for downstream 3D reconstruction.", styles))
    story.append(entry("Physics-informed neural fields, multi-sweep alignment, and 3D semantics", "2023 — present", "Integrated ultrasound-acoustic priors into continuous NeRF/3DGS representations. Decomposed multi-sweep error into sweep-level global bias, frame-level local jitter, and force-conditioned deformation, then jointly optimized poses, representations, and canonical-space alignment.", styles))
    story.append(entry("Navigation coordinates, puncture planning, and robotic systems", "2025 — present", "Connected stereo NIR tracking, probe and needle-tip calibration, continuous 3D fields, and tissue–instrument semantics into a navigation coordinate chain. Explored flexible-needle planning and compact puncture robots with repeatable phantoms and proof-of-principle prototypes.", styles))

    story += section("SELECTED FIRST-AUTHOR PUBLICATIONS", styles)
    papers = [
        "<b>Z. Fang</b>, et al. GLA-NeRF: Global-local aligned neural radiance fields for multi-sweep freehand 3D ultrasound. <i>Physics in Medicine &amp; Biology</i>, 2026.",
        "<b>Z. Fang</b>, et al. Prediction for Loosening Life of Bolted Joints Using IMUs With Dimensionality Reduction. <i>IEEE Transactions on Instrumentation and Measurement</i>, 72, 2023. DOI: 10.1109/TIM.2023.3276014.",
        "<b>Z. Fang</b>, et al. Fault Diagnosis Method for Industrial Robots based on Dimension Reduction and Random Forest. <i>M2VIP</i>, 2021. DOI: 10.1109/M2VIP49856.2021.9665168.",
    ]
    story.extend(Paragraph(f"- {paper}", styles["body"]) for paper in papers)

    story += section("TECHNICAL SKILLS", styles)
    story.append(Paragraph("<b>3D perception:</b> NeRF / 3DGS, acoustic inverse rendering, image localization, multi-sensor pose estimation, deformable registration, and 3D semantics.<br/><b>Robotics and engineering:</b> path planning, PyBullet / Isaac, PyQt / C#, STM32, CATIA / SolidWorks, Ansys / Adams.<br/><b>AI development:</b> PyTorch / Lightning, TensorFlow / JAX, diffusion, VLA, RAG, and multi-model applications.", styles["body"]))
    return story


def build_pdf(output: Path) -> None:
    register_fonts()
    styles = make_styles()
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=17 * mm,
        leftMargin=17 * mm,
        topMargin=14 * mm,
        bottomMargin=13 * mm,
        title="Zi Fang | Public Academic CV",
        author="Zi Fang",
        subject="Public academic CV for research and algorithm opportunities",
    )
    story = build_chinese_page(styles) + [PageBreak()] + build_english_page(styles)
    doc.build(story)


def main() -> None:
    parser = argparse.ArgumentParser(description="生成不包含私人联系方式、专利和未发布稿件的公开版学术简历。")
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="输出 PDF 路径")
    args = parser.parse_args()
    build_pdf(args.output.resolve())


if __name__ == "__main__":
    main()
