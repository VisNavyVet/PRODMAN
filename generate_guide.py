"""ProdMan User Guide PDF Generator"""

from fpdf import FPDF
import datetime

# -- Colour palette ------------------------------------------------------------
NAVY       = (15,  40,  80)
BLUE       = (30,  90, 180)
ACCENT     = (0, 140, 200)
LIGHT_BLUE = (230, 242, 252)
DARK_GRAY  = (50,  50,  50)
MID_GRAY   = (100, 100, 100)
LIGHT_GRAY = (245, 245, 247)
WHITE      = (255, 255, 255)
GREEN_BG   = (235, 250, 240)
GREEN_LINE = (0,  160,  80)
AMBER_BG   = (255, 250, 230)
AMBER_LINE = (200, 150,  0)
CODE_BG    = (30,   30,  40)
CODE_TEXT  = (180, 220, 180)


class ProdManGuide(FPDF):

    # -- internal state --------------------------------------------------------
    def __init__(self):
        super().__init__('P', 'mm', 'A4')
        self.set_auto_page_break(auto=True, margin=20)
        self.set_margins(22, 22, 22)
        self._toc = []          # (title, level, page)
        self._skip_header = False

    # -- running header / footer -----------------------------------------------
    def header(self):
        if self._skip_header or self.page_no() <= 2:
            return
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(*MID_GRAY)
        self.cell(0, 6, 'ProdMan -- User Guide', align='L')
        self.cell(0, 6, f'Page {self.page_no()}', align='R', new_x='LMARGIN', new_y='NEXT')
        self.set_draw_color(*LIGHT_BLUE)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(3)

    def footer(self):
        if self.page_no() <= 2:
            return
        self.set_y(-14)
        self.set_draw_color(*LIGHT_BLUE)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(2)
        self.set_font('Helvetica', 'I', 7.5)
        self.set_text_color(*MID_GRAY)
        self.cell(0, 6, 'prodman.dev  ·  MIT License', align='C')

    # -- helpers ---------------------------------------------------------------
    def _usable_w(self):
        return self.w - self.l_margin - self.r_margin

    def h1(self, text):
        """Section heading (large, coloured bar)"""
        self._toc.append((text, 1, self.page_no()))
        self.ln(6)
        # coloured left bar
        self.set_fill_color(*NAVY)
        self.rect(self.l_margin, self.get_y(), 4, 10, 'F')
        self.set_xy(self.l_margin + 7, self.get_y())
        self.set_font('Helvetica', 'B', 17)
        self.set_text_color(*NAVY)
        self.cell(0, 10, text, new_x='LMARGIN', new_y='NEXT')
        self.ln(3)
        self.set_text_color(*DARK_GRAY)

    def h2(self, text):
        """Sub-section heading"""
        self._toc.append((text, 2, self.page_no()))
        self.ln(4)
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(*BLUE)
        self.cell(0, 7, text, new_x='LMARGIN', new_y='NEXT')
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.5)
        self.line(self.l_margin, self.get_y(),
                  self.l_margin + self._usable_w() * 0.35, self.get_y())
        self.ln(3)
        self.set_text_color(*DARK_GRAY)

    def h3(self, text):
        """Command / item heading"""
        self.ln(3)
        self.set_font('Helvetica', 'B', 10.5)
        self.set_text_color(*ACCENT)
        self.cell(0, 6, text, new_x='LMARGIN', new_y='NEXT')
        self.set_text_color(*DARK_GRAY)

    def body(self, text, size=10):
        """Regular paragraph"""
        self.set_font('Helvetica', '', size)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(self._usable_w(), 5.5, text)
        self.ln(2)

    def bold_body(self, label, text, size=10):
        """Bold label + normal text on same line"""
        self.set_font('Helvetica', 'B', size)
        self.set_text_color(*DARK_GRAY)
        self.write(5.5, label + ' ')
        self.set_font('Helvetica', '', size)
        self.write(5.5, text)
        self.ln(5)

    def bullet(self, text, indent=4, size=10):
        x = self.get_x()
        y = self.get_y()
        self.set_font('Helvetica', '', size)
        self.set_text_color(*ACCENT)
        self.set_xy(self.l_margin + indent, y)
        self.cell(5, 5.5, '>')
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(self._usable_w() - indent - 5, 5.5, text)

    def numbered(self, n, text, indent=4, size=10):
        y = self.get_y()
        self.set_font('Helvetica', 'B', size)
        self.set_text_color(*ACCENT)
        self.set_xy(self.l_margin + indent, y)
        self.cell(7, 5.5, f'{n}.')
        self.set_font('Helvetica', '', size)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(self._usable_w() - indent - 7, 5.5, text)

    def code_block(self, text, label=''):
        """Monospaced dark code block"""
        w = self._usable_w()
        lines = text.split('\n')
        line_h = 5.2
        total_h = len(lines) * line_h + 8
        if label:
            total_h += 6
        # draw background
        self.set_fill_color(*CODE_BG)
        self.set_draw_color(*CODE_BG)
        self.rect(self.l_margin, self.get_y(), w, total_h, 'F')
        y_start = self.get_y() + 4
        if label:
            self.set_xy(self.l_margin + 4, y_start)
            self.set_font('Helvetica', 'I', 8)
            self.set_text_color(150, 150, 150)
            self.cell(w - 8, 5, label)
            y_start += 5
        self.set_text_color(*CODE_TEXT)
        for line in lines:
            self.set_xy(self.l_margin + 4, y_start)
            self.set_font('Courier', '', 9)
            self.cell(w - 8, line_h, line)
            y_start += line_h
        self.set_y(self.get_y() + total_h + 3)
        self.set_text_color(*DARK_GRAY)

    def inline_code(self, text):
        """Return styled inline code span (used within write calls)"""
        # fpdf2 can't truly inline-style; approximate with a box
        self.set_font('Courier', '', 9.5)
        self.set_text_color(180, 60, 60)
        self.write(5.5, f'`{text}`')
        self.set_font('Helvetica', '', 10)
        self.set_text_color(*DARK_GRAY)

    def callout(self, text, style='info'):
        """Coloured callout box"""
        if style == 'info':
            bg, line = LIGHT_BLUE, ACCENT
            icon = 'i  '
        elif style == 'tip':
            bg, line = GREEN_BG, GREEN_LINE
            icon = '[x]  '
        else:
            bg, line = AMBER_BG, AMBER_LINE
            icon = '(!)  '
        w = self._usable_w()
        self.set_font('Helvetica', '', 9.5)
        # estimate height
        n_lines = len(self.multi_cell(w - 14, 5.2, icon + text, dry_run=True, output='LINES'))
        h = n_lines * 5.2 + 8
        self.set_fill_color(*bg)
        self.set_draw_color(*line)
        self.set_line_width(0.8)
        # left border rect
        self.rect(self.l_margin, self.get_y(), 3, h, 'F')
        self.set_fill_color(*bg)
        self.rect(self.l_margin + 3, self.get_y(), w - 3, h, 'F')
        self.set_xy(self.l_margin + 7, self.get_y() + 4)
        self.set_text_color(*DARK_GRAY)
        self.multi_cell(w - 14, 5.2, icon + text)
        self.set_y(self.get_y() + 3)

    def divider(self):
        self.ln(3)
        self.set_draw_color(*LIGHT_BLUE)
        self.set_line_width(0.3)
        self.line(self.l_margin, self.get_y(),
                  self.w - self.r_margin, self.get_y())
        self.ln(4)

    def two_col_table(self, rows, col1_w=55, header=None):
        """Simple two-column table"""
        w2 = self._usable_w() - col1_w
        if header:
            self.set_fill_color(*NAVY)
            self.set_text_color(*WHITE)
            self.set_font('Helvetica', 'B', 9)
            self.cell(col1_w, 7, header[0], border=0, fill=True)
            self.cell(w2, 7, header[1], border=0, fill=True, new_x='LMARGIN', new_y='NEXT')
        for i, (c1, c2) in enumerate(rows):
            bg = LIGHT_GRAY if i % 2 == 0 else WHITE
            self.set_fill_color(*bg)
            self.set_text_color(*DARK_GRAY)
            self.set_font('Helvetica', 'B' if i == 0 and not header else '', 9)
            y0 = self.get_y()
            # measure height
            n1 = len(self.multi_cell(col1_w - 2, 5, c1, dry_run=True, output='LINES'))
            n2 = len(self.multi_cell(w2 - 2, 5, c2, dry_run=True, output='LINES'))
            row_h = max(n1, n2) * 5 + 2
            self.rect(self.l_margin, y0, col1_w, row_h, 'F')
            self.rect(self.l_margin + col1_w, y0, w2, row_h, 'F')
            self.set_xy(self.l_margin + 2, y0 + 1)
            self.set_font('Courier' if '/' in c1 and 'pm' in c1 else 'Helvetica',
                          'B' if '/' in c1 else '', 9)
            self.set_text_color(30, 100, 180 if '/' in c1 else 50)
            self.multi_cell(col1_w - 2, 5, c1)
            self.set_xy(self.l_margin + col1_w + 2, y0 + 1)
            self.set_font('Helvetica', '', 9)
            self.set_text_color(*DARK_GRAY)
            self.multi_cell(w2 - 2, 5, c2)
            self.set_y(y0 + row_h)
        self.ln(4)

    def multi_col_table(self, rows, header=None):
        """Multi-column table with equal-width columns"""
        n_cols = len(rows[0]) if rows else (len(header) if header else 2)
        w = self._usable_w()
        col_w = w / n_cols
        if header:
            self.set_fill_color(*NAVY)
            self.set_text_color(*WHITE)
            self.set_font('Helvetica', 'B', 8)
            for j, h in enumerate(header):
                nx = 'LMARGIN' if j == len(header) - 1 else 'RIGHT'
                ny = 'NEXT' if j == len(header) - 1 else 'TOP'
                self.cell(col_w, 7, h, border=0, fill=True, new_x=nx, new_y=ny)
        for i, row in enumerate(rows):
            bg = LIGHT_GRAY if i % 2 == 0 else WHITE
            self.set_fill_color(*bg)
            self.set_text_color(*DARK_GRAY)
            self.set_font('Helvetica', '', 8)
            y0 = self.get_y()
            heights = []
            for cell in row:
                n = len(self.multi_cell(col_w - 2, 5, str(cell), dry_run=True, output='LINES'))
                heights.append(n)
            row_h = max(heights) * 5 + 2
            for j, cell in enumerate(row):
                self.rect(self.l_margin + j * col_w, y0, col_w, row_h, 'F')
                self.set_xy(self.l_margin + j * col_w + 2, y0 + 1)
                self.multi_cell(col_w - 2, 5, str(cell))
            self.set_y(y0 + row_h)
        self.ln(4)

    def command_card(self, cmd, zone, desc, when, invoke_cc, invoke_other, output):
        """Full command reference card"""
        w = self._usable_w()
        # header bar
        self.set_fill_color(*NAVY)
        self.rect(self.l_margin, self.get_y(), w, 10, 'F')
        self.set_xy(self.l_margin + 4, self.get_y() + 1.5)
        self.set_font('Courier', 'B', 13)
        self.set_text_color(*WHITE)
        self.cell(w // 2, 7, cmd)
        self.set_font('Helvetica', 'I', 9)
        self.set_text_color(180, 210, 255)
        self.cell(0, 7, zone, align='R')
        self.ln(12)
        # body
        self.set_text_color(*DARK_GRAY)
        self.set_font('Helvetica', '', 9.5)
        self.multi_cell(w, 5.2, desc)
        self.ln(2)
        rows = [
            ('When to use', when),
            ('Claude Code', invoke_cc),
            ('Other AI tools', invoke_other),
            ('Output', output),
        ]
        for label, val in rows:
            self.set_font('Helvetica', 'B', 9)
            self.set_text_color(*ACCENT)
            self.write(5.5, label + ':  ')
            self.set_font('Helvetica', '', 9)
            self.set_text_color(*DARK_GRAY)
            self.multi_cell(0, 5.5, val)
        self.ln(5)
        self.divider()


# -- Build document -------------------------------------------------------------

pdf = ProdManGuide()
pdf._skip_header = True


# ==============================================================================
# COVER PAGE
# ==============================================================================
pdf.add_page()

# Full-page navy top band
pdf.set_fill_color(*NAVY)
pdf.rect(0, 0, 210, 90, 'F')

pdf.set_y(28)
pdf.set_font('Helvetica', 'B', 44)
pdf.set_text_color(*WHITE)
pdf.cell(0, 20, 'ProdMan', align='C', new_x='LMARGIN', new_y='NEXT')

pdf.set_font('Helvetica', '', 16)
pdf.set_text_color(160, 200, 240)
pdf.cell(0, 10, 'User Guide', align='C', new_x='LMARGIN', new_y='NEXT')

pdf.set_font('Helvetica', '', 10)
pdf.set_text_color(120, 170, 220)
pdf.cell(0, 8, 'Signal -> Frame -> Commit -> Spec -> Ship', align='C', new_x='LMARGIN', new_y='NEXT')

# Accent stripe
pdf.set_fill_color(*ACCENT)
pdf.rect(0, 90, 210, 3, 'F')

pdf.set_y(110)
pdf.set_font('Helvetica', '', 13)
pdf.set_text_color(*DARK_GRAY)
pdf.multi_cell(0, 7,
    'An open-source framework for Product Managers that eliminates the articulation\n'
    'gap, cold-start problem, and handover gap -- using plain Markdown commands\n'
    'that work in any AI tool.',
    align='C')

pdf.ln(12)
pdf.set_font('Helvetica', 'B', 10)
pdf.set_text_color(*BLUE)
pdf.cell(0, 6, 'What you will find in this guide', align='C', new_x='LMARGIN', new_y='NEXT')
pdf.ln(4)

items = [
    'Complete command reference with usage examples',
    'Step-by-step product context setup',
    'End-to-end workflow walkthrough',
    'Integration guides for Claude Code, Cursor, and any AI tool',
    'Tips and best-practice patterns',
]
for item in items:
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(*DARK_GRAY)
    pdf.cell(0, 7, f'  >  {item}', align='C', new_x='LMARGIN', new_y='NEXT')

# Bottom meta
pdf.set_y(-30)
pdf.set_fill_color(*LIGHT_GRAY)
pdf.rect(0, pdf.get_y(), 210, 30, 'F')
pdf.set_y(pdf.get_y() + 8)
pdf.set_font('Helvetica', '', 9)
pdf.set_text_color(*MID_GRAY)
pdf.cell(0, 5, f'Version 0  ·  {datetime.date.today().strftime("%B %Y")}  ·  MIT License', align='C')


# ==============================================================================
# TABLE OF CONTENTS  (placeholder -- filled after all pages known)
# ==============================================================================
pdf.add_page()
pdf._skip_header = False

pdf.set_font('Helvetica', 'B', 20)
pdf.set_text_color(*NAVY)
pdf.cell(0, 12, 'Table of Contents', new_x='LMARGIN', new_y='NEXT')
pdf.set_draw_color(*ACCENT)
pdf.set_line_width(1)
pdf.line(pdf.l_margin, pdf.get_y(), pdf.l_margin + 60, pdf.get_y())
pdf.ln(6)

# We'll output a static TOC since fpdf2 doesn't auto-generate
toc_sections = [
    ('1', 'Introduction & The Problem ProdMan Solves', '3'),
    ('2', 'Core Philosophy', '4'),
    ('3', 'Repository Structure', '5'),
    ('4', 'Quick Start', '6'),
    ('5', 'Setting Up Product Context', '7'),
    ('6', 'Command Reference', '9'),
    ('  6.1', '/pm-signal -- Capture a Raw Signal', '10'),
    ('  6.2', '/pm-frame -- Generate Problem Framings', '11'),
    ('  6.3', '/pm-explore -- Deep-Dive a Framing', '12'),
    ('  6.4', '/pm-commit -- Lock In a Direction', '13'),
    ('  6.5', '/pm-attach -- Add Files to Context', '14'),
    ('  6.6', '/pm-ff -- Fast-Forward to Full Spec', '15'),
    ('  6.7', '/pm-research -- Research Artifacts', '16'),
    ('  6.8', '/pm-handoff -- Audience-Specific Handoffs', '17'),
    ('  6.9', '/pm-agent-brief -- AI Agent Brief', '18'),
    ('  6.10', '/pm-ship -- Launch Coordination', '18'),
    ('  6.11', '/pm-retro -- Retrospective', '19'),
    ('  6.12', '/pm-import -- Bootstrap from Existing Docs', '19'),
    ('7', 'End-to-End Workflow Walkthrough', '20'),
    ('8', 'Output Layers', '22'),
    ('9', 'Integration Guides', '23'),
    ('10', 'Tips & Best Practices', '25'),
]

for num, title, page in toc_sections:
    is_sub = num.startswith(' ')
    indent = 8 if is_sub else 0
    pdf.set_xy(pdf.l_margin + indent, pdf.get_y())
    pdf.set_font('Helvetica', 'B' if not is_sub else '', 10)
    pdf.set_text_color(*NAVY if not is_sub else DARK_GRAY)
    pdf.cell(10 - indent, 6.5, num)
    pdf.set_font('Helvetica', '' if is_sub else 'B', 10)
    label_w = pdf._usable_w() - 24 - indent
    pdf.cell(label_w, 6.5, title)
    # dot leader
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(*MID_GRAY)
    pdf.cell(14, 6.5, f'..{page}', align='R', new_x='LMARGIN', new_y='NEXT')


# ==============================================================================
# 1. INTRODUCTION
# ==============================================================================
pdf.add_page()
pdf.h1('1. Introduction')

pdf.body(
    'ProdMan is an open-source framework that helps Product Managers move from raw signals '
    'to handover-ready deliverables -- without losing context between AI sessions or '
    'between audiences. It is a collection of Markdown prompt files, context templates, '
    'and output schemas that work in any AI tool.'
)

pdf.h2('The Three Gaps ProdMan Solves')

pdf.h3('Gap 1 -- The Articulation Gap')
pdf.body(
    'Ideas stay fuzzy because there is no structured path from "I noticed something" to '
    '"here is the crisp problem statement." ProdMan\'s Zone 1 commands (pm-signal, '
    'pm-frame, pm-explore, pm-commit) run you through a Socratic dialogue that forces '
    'clarity before any spec is written.'
)

pdf.h3('Gap 2 -- The Cold-Start Problem')
pdf.body(
    'Every AI session starts from zero. You re-explain your product, your users, and your '
    'constraints every time. ProdMan solves this with the prodman-context/ folder -- four '
    'Markdown files that store your product memory and are loaded automatically by every '
    'command.'
)

pdf.h3('Gap 3 -- The Handover Gap')
pdf.body(
    'Even solid specs get lost in translation. Engineers receive Notion docs; designers '
    'get vague user stories; AI coding agents receive prompts with no constraints. '
    'ProdMan\'s Zone 4 commands reformat the same spec into audience-specific deliverables '
    'that recipients can act on immediately.'
)

pdf.h2('Who ProdMan Is For')

types = [
    ('Stuck PM (Type A)',
     'Recognises opportunities but cannot articulate them clearly. '
     'Start with /pm-signal and let the dialogue do the work.'),
    ('Fuzzy PM (Type B)',
     'Knows roughly what to build but struggles converting ideas into formal specs. '
     'Use /pm-commit then /pm-ff for a complete spec bundle in one session.'),
    ('Executor PM (Type C)',
     'Knows exactly what to build and prioritises speed and clean handoffs. '
     'Run /pm-ff directly, then /pm-agent-brief to hand off to an AI coding agent.'),
]
for title, desc in types:
    pdf.ln(2)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(*BLUE)
    pdf.write(5.5, title + ' -- ')
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(0, 5.5, desc)


# ==============================================================================
# 2. CORE PHILOSOPHY
# ==============================================================================
pdf.add_page()
pdf.h1('2. Core Philosophy')

pdf.body(
    'Six principles underpin every ProdMan command. Understanding them helps you get the '
    'most out of the framework and explain it to your team.'
)

principles = [
    ('Materialise clarity before documentation',
     'Specs should describe problems that are already understood. ProdMan refuses to jump '
     'to documentation until the problem is crisp. The Zone 1 commands exist for this reason.'),
    ('Questioning precedes answering',
     'ProdMan asks before it prescribes. Commands in Zone 1 use a Socratic dialogue -- one '
     'question at a time -- to surface the real problem rather than the stated one.'),
    ('Present options, not prescriptions',
     'The /pm-frame command generates multiple distinct problem framings for the PM to react '
     'against. ProdMan does not decide which framing is correct -- the PM does.'),
    ('Context-first operations',
     'Every command begins by reading prodman-context/ to ground the response in your '
     'specific product, users, and constraints. No generic output.'),
    ('Generate immediately actionable deliverables',
     'Every output should be usable without a follow-up meeting. Engineering handoffs '
     'include acceptance criteria; agent briefs include explicit "do not touch" lists.'),
    ('Remain AI-agnostic and platform-independent',
     'Commands are plain Markdown files that work in Claude, GPT, Gemini, Cursor, or any '
     'AI interface. No vendor lock-in. The source of truth lives in prodman/commands/.'),
]

for i, (title, desc) in enumerate(principles, 1):
    pdf.set_fill_color(*LIGHT_BLUE)
    pdf.rect(pdf.l_margin, pdf.get_y(), pdf._usable_w(), 8, 'F')
    pdf.set_xy(pdf.l_margin + 4, pdf.get_y() + 1)
    pdf.set_font('Helvetica', 'B', 10.5)
    pdf.set_text_color(*NAVY)
    pdf.cell(6, 6, str(i))
    pdf.set_text_color(*BLUE)
    pdf.multi_cell(pdf._usable_w() - 10, 6, title)
    pdf.set_xy(pdf.l_margin + 10, pdf.get_y())
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(pdf._usable_w() - 10, 5.2, desc)
    pdf.ln(4)


# ==============================================================================
# 3. REPOSITORY STRUCTURE
# ==============================================================================
pdf.add_page()
pdf.h1('3. Repository Structure')

pdf.body(
    'ProdMan is a folder of Markdown files. There is no build step, no dependencies, '
    'and no installation required. Clone it, fill in your context, and start.'
)

pdf.code_block(
    'ProdMan/\n'
    '|-- README.md               # Overview and quick-start\n'
    '|-- CLAUDE.md               # Auto-loaded instructions for Claude Code\n'
    '|-- CONTRIBUTING.md\n'
    '|\n'
    '|-- prodman/\n'
    '|   +-- commands/           # SOURCE OF TRUTH for all 11 commands\n'
    '|       |-- pm-signal.md\n'
    '|       |-- pm-frame.md\n'
    '|       |-- pm-explore.md\n'
    '|       |-- pm-commit.md\n'
    '|       |-- pm-attach.md\n'
    '|       |-- pm-ff.md\n'
    '|       |-- pm-research.md\n'
    '|       |-- pm-handoff.md\n'
    '|       |-- pm-agent-brief.md\n'
    '|       |-- pm-ship.md\n'
    '|       |-- pm-retro.md\n'
    '|       +-- pm-import.md\n'
    '|\n'
    '|-- .claude/\n'
    '|   +-- commands/           # Pointer stubs -> Claude Code slash commands\n'
    '|       +-- pm-*.md         # Each file: one line pointing to prodman/commands/\n'
    '|\n'
    '|-- templates/\n'
    '|   |-- context/            # Copy these to prodman-context/ and fill in\n'
    '|   |   |-- product.md\n'
    '|   |   |-- users.md\n'
    '|   |   |-- constraints.md\n'
    '|   |   +-- history.md\n'
    '|   +-- features/           # Output templates written by /pm-ff\n'
    '|       |-- brief.md\n'
    '|       |-- prd.md\n'
    '|       |-- approach.md\n'
    '|       +-- plan.md\n'
    '|\n'
    '|-- schemas/                # Output format specifications\n'
    '|   |-- spec-bundle.md\n'
    '|   |-- ticket-breakdown.md\n'
    '|   +-- agent-handover.md\n'
    '|\n'
    '+-- integrations/           # Tool-specific setup guides\n'
    '    |-- vscode-claude.md\n'
    '    |-- cursor.md\n'
    '    |-- claude-projects.md\n'
    '    +-- universal.md',
    label='directory tree'
)

pdf.callout(
    'The source of truth for all commands is prodman/commands/. '
    'The .claude/commands/ folder contains one-line pointer stubs so Claude Code '
    'can expose native slash commands without duplicating the logic.',
    style='info'
)

pdf.h2('Key Folders')

rows = [
    ('prodman/commands/', 'The 11 command files. Edit these to customise behaviour.'),
    ('.claude/commands/', 'Pointer stubs -- do not edit. Enables Claude Code slash commands.'),
    ('prodman-context/', 'YOUR product memory. Created by you, loaded by every command.'),
    ('features/', 'Output folder. /pm-ff writes spec bundles here per feature.'),
    ('templates/context/', 'Blank templates to copy into prodman-context/ when starting.'),
    ('schemas/', 'Output structure definitions. Reference when contributing.'),
    ('integrations/', 'Tool-specific setup guides for Claude Code, Cursor, etc.'),
]
pdf.two_col_table(rows, col1_w=52, header=('Folder', 'Purpose'))


# ==============================================================================
# 4. QUICK START
# ==============================================================================
pdf.add_page()
pdf.h1('4. Quick Start')

pdf.body('You can be running your first command in under five minutes.')

pdf.h2('Step 1 -- Get ProdMan')

pdf.code_block(
    '# Option A: clone the repo\n'
    'git clone https://github.com/your-org/prodman.git\n\n'
    '# Option B: download the ZIP and extract\n'
    '# Option C: copy prodman/commands/ into any existing repo',
    label='terminal'
)

pdf.h2('Step 2 -- Create Your Product Context Folder')

pdf.code_block(
    'mkdir prodman-context\n'
    'cp templates/context/product.md     prodman-context/product.md\n'
    'cp templates/context/users.md       prodman-context/users.md\n\n'
    '# Optional:\n'
    'cp templates/context/constraints.md prodman-context/constraints.md\n'
    'cp templates/context/history.md     prodman-context/history.md',
    label='terminal'
)

pdf.body(
    'Open prodman-context/product.md and fill in what your product does, '
    'how it is positioned, and your key metrics. Then open users.md and define your 2-3 '
    'most important user segments. This is the only setup required.'
)

pdf.callout(
    'Already have existing product docs? Skip manual setup and run /pm-import instead. '
    'Paste your existing documentation and ProdMan will extract and write the four '
    'context files automatically.',
    style='tip'
)

pdf.h2('Step 3 -- Open Your AI Tool')

pdf.body(
    'Choose how you want to use ProdMan:'
)

options = [
    ('Claude Code (VS Code)',
     'The native experience. Type / in the chat panel and select any /pm- command.'),
    ('Cursor',
     'Add the ProdMan Cursor Rule (see integrations/cursor.md), then type "Run /pm-signal ..." in chat.'),
    ('Claude Projects',
     'Upload your context files and command files to a Project. Use commands directly in chat.'),
    ('Any other AI tool',
     'Open prodman/commands/pm-signal.md, copy the contents, paste into your AI chat, add your signal.'),
]
for tool, desc in options:
    pdf.set_font('Helvetica', 'B', 9.5)
    pdf.set_text_color(*BLUE)
    pdf.write(5.5, tool + ':  ')
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(0, 5.5, desc)
    pdf.ln(1)

pdf.h2('Step 4 -- Run Your First Command')

pdf.code_block(
    '/pm-signal Our checkout abandonment rate jumped 15% after last week\'s release',
    label='Claude Code'
)

pdf.body(
    'ProdMan will read your product context, acknowledge the signal, and ask you one '
    'clarifying question. Answer it. Continue the dialogue. When ready, run /pm-frame '
    'to get 2-3 distinct problem framings. Choose one and continue through the workflow.'
)


# ==============================================================================
# 5. SETTING UP PRODUCT CONTEXT
# ==============================================================================
pdf.add_page()
pdf.h1('5. Setting Up Product Context')

pdf.body(
    'The prodman-context/ folder is ProdMan\'s memory. Without it, every command starts '
    'cold. With it, every command knows your product, your users, and your constraints '
    'before asking a single question.'
)

pdf.h2('product.md -- What Your Product Is')

pdf.body(
    'The most important context file. Fill in every section before your first session.'
)

pdf.code_block(
    '# Product Context\n\n'
    '## What We Build\n'
    'Acme is a B2B invoicing tool for freelancers and small agencies.\n'
    'It automates invoice creation, payment reminders, and Stripe reconciliation.\n\n'
    '## Positioning\n'
    'Faster to set up than FreshBooks. Cheaper than QuickBooks. We do not do payroll.\n\n'
    '## Core Value Proposition\n'
    'Get paid faster without chasing clients.\n\n'
    '## Current Stage\n'
    'Growth -- PMF with freelancers, now expanding to small agencies (2-10 people).\n\n'
    '## Key Metrics\n'
    '- Primary: invoices sent per active user per month\n'
    '- Secondary: payment rate within 14 days\n'
    '- Retention: D30 active rate\n\n'
    '## Product Principles\n'
    '- Never require a sales call to explain a feature\n'
    '- Mobile-first for invoice creation; desktop for reporting',
    label='prodman-context/product.md -- example'
)

pdf.h2('users.md -- Who Your Users Are')

pdf.callout(
    '"Users" is not a segment. Name each segment, describe their context, '
    'and articulate the job they are hiring your product to do. '
    'Vague segment descriptions lead to vague specs.',
    style='warning'
)

pdf.code_block(
    '# User Segments\n\n'
    '## Segment 1: Solo Freelancer\n'
    '- Who they are: Independent designers/developers, 1-3 clients, working alone.\n'
    '- What they\'re trying to do: Get paid on time without awkward follow-ups.\n'
    '- Where they struggle: Remembering to send reminders; clients pay late.\n'
    '- What success looks like: Invoice sent, paid within 7 days, no chasing.\n'
    '- Usage pattern: Monthly invoice cycle, primarily mobile.\n\n'
    '## Segment 2: Agency Owner\n'
    '- Who they are: Runs a 2-8 person studio, multiple concurrent client projects.\n'
    '- What they\'re trying to do: Track which invoices are outstanding across all clients.\n'
    '- Where they struggle: No single view of cash flow across projects.\n'
    '- What success looks like: Instant cash flow visibility, team can create invoices.\n'
    '- Usage pattern: Weekly review, desktop, delegates invoice creation to team.\n\n'
    '## Who We\'re NOT Building For\n'
    'Enterprise (50+ seat) procurement teams. No compliance/SSO infrastructure.',
    label='prodman-context/users.md -- example'
)

pdf.h2('constraints.md -- What Limits You')

pdf.body(
    'Optional but valuable. Prevents commands from suggesting solutions that are '
    'technically impossible or organisationally blocked.'
)

rows = [
    ('Section', 'What to include'),
    ('Technical Constraints', 'Stack limitations, no native mobile, no third-party data enrichment'),
    ('Legal / Compliance', 'GDPR, SOC 2, payment card data rules'),
    ('Org Constraints', 'Team size, sprint cadence, design capacity'),
    ('Non-Starters', 'Things leadership has explicitly ruled out'),
]
pdf.two_col_table(rows, col1_w=52)

pdf.h2('history.md -- Decisions Already Made')

pdf.body(
    'Grows over time. After each /pm-retro run, ProdMan proposes additions to this file. '
    'It prevents your team from re-litigating decisions that have already been made.'
)

rows = [
    ('Section', 'What to include'),
    ('Features Shipped', 'Name, date, outcome (hit/missed/mixed), key learning'),
    ('Things That Did Not Work', 'Experiments or bets that failed and why'),
    ('Active Strategic Bets', 'Current investments expected to pay off in 6-18 months'),
    ('Ruled Out', 'Ideas explicitly rejected and the reason, with a revisit condition'),
]
pdf.two_col_table(rows, col1_w=52)


# ==============================================================================
# 6. COMMAND REFERENCE
# ==============================================================================
pdf.add_page()
pdf.h1('6. Command Reference')

pdf.body(
    'ProdMan has 12 commands organised across five zones. Each command is a Markdown '
    'file in prodman/commands/. Commands use $ARGUMENTS as a placeholder for whatever '
    'you type after the command name.'
)

# Zone overview table
zones = [
    ('Zone 1 -- Materialization', '/pm-signal, /pm-frame, /pm-explore, /pm-commit, /pm-attach',
     'Turn raw signals into clear, committed problem directions'),
    ('Zone 2 -- Planning', '/pm-ff',
     'Generate the full spec bundle from a committed direction'),
    ('Zone 3 -- Research', '/pm-research',
     'Interview guides, competitive benchmarking, prioritisation scoring'),
    ('Zone 4 -- Handover', '/pm-handoff, /pm-agent-brief',
     'Reformat specs for specific audiences (engineer, designer, AI agent)'),
    ('Zone 5 -- Ship & Learn', '/pm-ship, /pm-retro',
     'Launch coordination and post-launch retrospectives'),
    ('Utility', '/pm-import',
     'Bootstrap prodman-context/ from existing product docs'),
]

pdf.set_fill_color(*NAVY)
pdf.set_font('Helvetica', 'B', 9)
pdf.set_text_color(*WHITE)
w = pdf._usable_w()
pdf.cell(52, 7, 'Zone', fill=True)
pdf.cell(60, 7, 'Commands', fill=True)
pdf.cell(w - 112, 7, 'Purpose', fill=True, new_x='LMARGIN', new_y='NEXT')

for i, (zone, cmds, purpose) in enumerate(zones):
    bg = LIGHT_GRAY if i % 2 == 0 else WHITE
    pdf.set_fill_color(*bg)
    y0 = pdf.get_y()
    n1 = len(pdf.multi_cell(52, 5, zone, dry_run=True, output='LINES'))
    n2 = len(pdf.multi_cell(60, 5, cmds, dry_run=True, output='LINES'))
    n3 = len(pdf.multi_cell(w - 112, 5, purpose, dry_run=True, output='LINES'))
    rh = max(n1, n2, n3) * 5 + 3
    pdf.rect(pdf.l_margin, y0, w, rh, 'F')
    pdf.set_xy(pdf.l_margin + 1, y0 + 1.5)
    pdf.set_font('Helvetica', 'B', 8.5)
    pdf.set_text_color(*NAVY)
    pdf.multi_cell(51, 5, zone)
    pdf.set_xy(pdf.l_margin + 53, y0 + 1.5)
    pdf.set_font('Courier', '', 8.5)
    pdf.set_text_color(30, 100, 180)
    pdf.multi_cell(59, 5, cmds)
    pdf.set_xy(pdf.l_margin + 113, y0 + 1.5)
    pdf.set_font('Helvetica', '', 8.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(w - 113, 5, purpose)
    pdf.set_y(y0 + rh)
pdf.ln(5)


# -- 6.1 pm-signal -------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-signal', 'Zone 1 -- Materialization',
    'Starts the ProdMan workflow. Share any raw signal -- a customer complaint, a metric '
    'anomaly, a stakeholder request, an observed behaviour, a gut feeling -- and ProdMan '
    'begins a Socratic dialogue to help you understand it before framing it.',
    'Whenever you have something worth investigating but are not yet sure what the real '
    'problem is. This is your entry point.',
    '/pm-signal [paste your signal here]',
    'Open prodman/commands/pm-signal.md, copy contents, paste into chat, add your signal.',
    'Clarifying dialogue. Ends when ProdMan says it is ready to frame.',
)

pdf.h2('How pm-signal Works')
pdf.body(
    'ProdMan will first identify the signal type (complaint, metric, idea, observation, '
    'competitive signal) and reflect it back in 1-2 sentences. It then asks exactly one '
    'clarifying question -- grounded in what you shared, not a generic template question.'
)
pdf.body(
    'After you answer, it asks another single question. This continues until ProdMan has '
    'a clear picture of: who is specifically affected, what they are experiencing or doing, '
    'what the signal suggests is broken or missing, and why it matters.'
)

pdf.h2('Questioning Rules')
bullets = [
    'One question at a time -- never compound questions',
    '"Users" is not a valid segment -- ProdMan will push for specificity',
    'Questions distinguish symptoms from root causes',
    'Prior attempts are explored (what has already been tried?)',
    'ProdMan synthesises periodically before asking the next question',
]
for b in bullets:
    pdf.bullet(b)

pdf.ln(3)
pdf.callout(
    'If your signal is already detailed and specific, ProdMan skips the dialogue and '
    'tells you it is ready to frame immediately. You can also go straight to /pm-frame '
    'if you already have enough context.',
    style='tip'
)

pdf.h2('Example')
pdf.code_block(
    '/pm-signal\n'
    'We are seeing a 15% spike in support tickets tagged "can\'t find past orders"\n'
    'over the past two weeks. It started right after the navigation redesign.',
    label='you type'
)
pdf.code_block(
    'Signal type: metric + support volume spike, correlated with a product change.\n\n'
    'Reflecting back: You are seeing a meaningful increase in users struggling to locate\n'
    'their order history, and the timing correlates with a recent navigation update.\n\n'
    'One question: Which users are raising these tickets -- new users who have never\n'
    'found the orders page before, or existing users who knew where it was previously?',
    label='ProdMan responds'
)


# -- 6.2 pm-frame --------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-frame', 'Zone 1 -- Materialization',
    'Generates 2-3 distinct problem framings for the PM to react against. Each framing '
    'has a different root hypothesis, implied direction, key assumption, and explicit '
    'exclusions. Framings are lenses, not answers -- the PM chooses which resonates.',
    'After /pm-signal dialogue, when you have enough context to start framing. Also useful '
    'when you have explored a signal and want to re-frame it differently.',
    '/pm-frame (uses conversation context) or /pm-frame [brief summary if starting fresh]',
    'Open prodman/commands/pm-frame.md and paste into chat after your signal exploration.',
    '2-3 distinct problem framings. PM selects or reacts. ProdMan refines.',
)

pdf.h2('Framing Structure')
pdf.body('Each framing ProdMan generates includes five fields:')
rows = [
    ('Field', 'What it means'),
    ('Problem statement', '1-2 sentences: who is affected, what they experience, why it matters'),
    ('Root hypothesis', 'What is actually broken or missing underneath the symptoms'),
    ('Implied direction', 'The kind of solution this framing points toward (no prescription)'),
    ('Key assumption', 'The most important thing that must be true for this framing to be correct'),
    ('What this excludes', 'What you would deliberately not address if you chose this frame'),
]
pdf.two_col_table(rows, col1_w=50)

pdf.callout(
    'At least one framing should challenge the obvious interpretation. If all three '
    'framings feel the same, ask ProdMan to generate a "challenge framing" that assumes '
    'the obvious solution is wrong.',
    style='tip'
)


# -- 6.3 pm-explore ------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-explore', 'Zone 1 -- Materialization',
    'Runs a structured deep-dive on a chosen problem framing. Covers six dimensions: user '
    'specificity, current behaviour, root cause vs. symptom, prior attempts, success criteria, '
    'and constraints. One question at a time.',
    'After selecting a framing from /pm-frame, when you need to build a full picture before '
    'committing. Skip if you already have detailed answers to most dimensions.',
    '/pm-explore [framing number or brief description]',
    'Paste pm-explore.md into chat after /pm-frame, specifying which framing.',
    'Structured conversation covering all six exploration dimensions.',
)

pdf.h2('The Six Exploration Dimensions')
dims = [
    ('1. User specificity', 'Exactly who experiences this. What distinguishes them from users who do not.'),
    ('2. Current behaviour', 'What they do today. What the workaround is and what it costs them.'),
    ('3. Root cause vs. symptom', 'Why the problem exists. Whether something changed recently to make it worse.'),
    ('4. Prior attempts', 'What the team has already tried. Known reasons why obvious solutions do not work.'),
    ('5. Success criteria', 'What "fixed" looks like for the affected user. Which metric would move.'),
    ('6. Constraints', 'Technical, legal, or org constraints. Appetite for scope (targeted fix vs. broader rethink).'),
]
for dim, desc in dims:
    pdf.bold_body(dim + ':', desc)


# -- 6.4 pm-commit -------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-commit', 'Zone 1 -- Materialization',
    'Synthesises everything from the signal -> frame -> explore dialogue into a locked-in '
    'direction statement. Produces a structured commitment document that the PM confirms '
    'before any spec work begins.',
    'After /pm-explore (or /pm-frame if you skipped exploration), when you are ready to '
    'commit to a direction and start generating specs.',
    '/pm-commit (uses conversation) or /pm-commit [overrides or corrections]',
    'Paste pm-commit.md into chat. ProdMan synthesises from the conversation context.',
    'Direction Commitment document. PM confirms. Then: /pm-ff to write the spec bundle.',
)

pdf.h2('Direction Commitment Document Structure')
rows = [
    ('Field', 'What it contains'),
    ('Problem statement', '1-2 sentences. Specific and falsifiable.'),
    ('We are solving for', 'The exact user segment and job-to-be-done.'),
    ('We are NOT solving for', 'Explicit scope exclusions. Just as important as scope-in.'),
    ('Direction', '2-4 sentences. Strategic direction, not full spec.'),
    ('Key assumptions', '2-3 things that must be true for this to succeed.'),
    ('Top risks', '2-3 things most likely to cause a pivot.'),
    ('Success looks like', 'Observable, measurable. What metric moves and by how much.'),
    ('Out of scope (explicitly)', 'Items from exploration that are excluded with rationale.'),
]
pdf.two_col_table(rows, col1_w=55)

pdf.callout(
    'The commitment document is a contract. Before running /pm-ff, make sure the '
    '"We are NOT solving for" and "Out of scope" sections are as detailed as the '
    '"We are solving for" section. This prevents scope creep during implementation.',
    style='warning'
)


# -- 6.5 pm-attach -------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-attach', 'Zone 1 -- Utility',
    'Loads an attached file or pasted content into the working context. ProdMan '
    'summarises the content, calls out the most relevant signals, and asks how you '
    'want to use it.',
    'Any time you have supporting material -- screenshots, NPS data, interview transcripts, '
    'support exports, research reports -- that should inform the current problem exploration.',
    '/pm-attach [paste content or describe the file]',
    'Paste pm-attach.md into chat, then paste or describe your attachment.',
    'Summary of the attachment + 2-3 key signals + a question about how to use it.',
)

pdf.h2('Supported Attachment Types')
rows = [
    ('Type', 'What ProdMan does with it'),
    ('Images (screenshots, wireframes, whiteboards)', 'Describes what is visible; notes signals, questions, or constraints'),
    ('Spreadsheets / data exports', 'Summarises key patterns, outliers, and what the data suggests'),
    ('PDFs / research reports', 'Extracts findings relevant to the current problem'),
    ('Text / notes / interview transcripts', 'Identifies themes, repeated complaints, user quotes'),
]
pdf.two_col_table(rows, col1_w=72)


# -- 6.6 pm-ff -----------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-ff', 'Zone 2 -- Planning',
    'Fast-Forward. Takes the committed direction and generates a complete four-file spec '
    'bundle: a one-page brief, a full PRD, an approach document, and a plan. All four '
    'files are written to features/[feature-name]/ using kebab-case.',
    'After /pm-commit confirms the direction. This is the primary spec generation command.',
    '/pm-ff [feature name e.g. order-history-search]',
    'Paste pm-ff.md into chat after confirming your direction commitment.',
    'Four Markdown files written to features/[name]/: brief.md, prd.md, approach.md, plan.md',
)

pdf.h2('The Four Output Files')

files = [
    ('brief.md', '1 page',
     'Problem, solution, success metrics table, scope (in/out), key risks. '
     'Readable in 2 minutes. For the PM and immediate team.'),
    ('prd.md', 'Full length',
     'Background, problem statement, goals, non-goals, user stories (P0/P1/P2), '
     'requirements, edge cases, open questions, success criteria, dependencies, out-of-scope table.'),
    ('approach.md', '1-2 pages',
     'Options considered (min 2), chosen option with explicit rationale, technical '
     'and design considerations, rollout strategy, assumptions.'),
    ('plan.md', '1-2 pages',
     'Timeline milestones, work breakdown by function (discovery/design/eng/QA/launch), '
     'dependencies, risks, communication plan.'),
]

for fname, length, desc in files:
    pdf.set_fill_color(*LIGHT_BLUE)
    pdf.rect(pdf.l_margin, pdf.get_y(), pdf._usable_w(), 7, 'F')
    pdf.set_xy(pdf.l_margin + 3, pdf.get_y() + 1)
    pdf.set_font('Courier', 'B', 10)
    pdf.set_text_color(*NAVY)
    pdf.write(5, fname + '  ')
    pdf.set_font('Helvetica', 'I', 9)
    pdf.set_text_color(*MID_GRAY)
    pdf.write(5, f'({length})')
    pdf.ln(9)
    pdf.set_xy(pdf.l_margin + 3, pdf.get_y())
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(pdf._usable_w() - 3, 5.2, desc)
    pdf.ln(3)


# -- 6.7 pm-research -----------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-research', 'Zone 3 -- Research',
    'Generates research artifacts to support discovery. Four artifact types: user interview '
    'guide, competitive benchmarking matrix, prioritisation scoring (RICE), and validation '
    'survey questions.',
    'Before or alongside spec work, when you need to validate assumptions, understand '
    'competitors, or prioritise between options.',
    '/pm-research interview  OR  /pm-research competitive  OR  /pm-research prioritize  OR  /pm-research survey',
    'Paste pm-research.md and specify which artifact type you need.',
    'Structured artifact (interview guide, competitive matrix, RICE table, or survey).',
)

pdf.h2('Artifact Types')
rows = [
    ('interview', 'User interview guide: objective, screener, warm-up, 6 core questions, probes'),
    ('competitive', 'Benchmarking matrix: how competitors address the specific problem, white space'),
    ('prioritize', 'RICE scoring table: Reach × Impact × Confidence ÷ Effort for each option'),
    ('survey', 'Validation survey: screener, frequency, difficulty, open text, solution test'),
]
pdf.two_col_table(rows, col1_w=35)


# -- 6.8 pm-handoff ------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-handoff', 'Zone 4 -- Handover',
    'Reformats the spec bundle for a specific audience. Each handoff is a new file that '
    'the recipient can act on immediately without a meeting. Three audience types: engineer, '
    'designer, and stakeholder.',
    'After /pm-ff generates the spec bundle, when you need to share the work with a '
    'specific team or person.',
    '/pm-handoff engineer  OR  /pm-handoff designer  OR  /pm-handoff stakeholder',
    'Paste pm-handoff.md into chat and specify the target audience.',
    'A new file written to features/[name]/: handoff-eng.md, handoff-design.md, or stakeholder-brief.md',
)

pdf.h2('Audience-Specific Content')
rows = [
    ('Audience', 'What the handoff emphasises'),
    ('engineer', 'Acceptance criteria (testable), edge cases table, error states, technical notes, open questions, Definition of Done'),
    ('designer', 'Jobs to be done, user journeys (current + target state), key screens/surfaces, constraints, success criteria for design'),
    ('stakeholder', 'What and why (no jargon), problem in plain language, success metrics, timeline, explicit non-scope with rationale'),
]
pdf.two_col_table(rows, col1_w=35)


# -- 6.9 pm-agent-brief --------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-agent-brief', 'Zone 4 -- Handover',
    'Generates a structured brief optimised for AI coding agents. Precise, bounded, and '
    'unambiguous -- the agent knows exactly what to build, what not to touch, when to stop '
    'and ask, and what "done" means.',
    'After /pm-ff and /pm-handoff engineer, when you are ready to give the implementation '
    'task to Claude Code, Cursor Agent, Copilot Workspace, Devin, or similar.',
    '/pm-agent-brief [feature name or path to spec]',
    'Paste pm-agent-brief.md into chat with the feature context.',
    'agent-brief.md written to features/[name]/. Paste this directly into your AI coding agent.',
)

pdf.h2('What Makes an Agent Brief Effective')
bullets = [
    'Task summary uses precise verbs (display, validate, write, return) -- not vague ones (handle, manage, support)',
    'Every acceptance criterion is verifiable without PM judgment -- no "looks good" criteria',
    'Out-of-scope list includes the 2 most tempting things to accidentally change',
    'Escalation triggers cover the top ambiguous decision points the agent would otherwise guess at',
    'Tech context points to specific file paths, not "the frontend"',
    'Definition of Done includes specific analytics event names, not just "instrument metrics"',
]
for b in bullets:
    pdf.bullet(b)

# -- 6.10 pm-ship --------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-ship', 'Zone 5 -- Ship & Learn',
    'Generates a launch coordination package: pre-launch checklist (product, engineering, '
    'design, data, support, legal), launch day steps, post-launch monitoring plan, '
    'communication plan, and phased rollout table.',
    'When you are ready to ship and need to coordinate across teams.',
    '/pm-ship [feature name and target launch date]',
    'Paste pm-ship.md into chat with the feature and launch context.',
    'Launch coordination document covering pre-launch, launch day, post-launch, comms, and rollout phases.',
)

# -- 6.11 pm-retro -------------------------------------------------------------
pdf.command_card(
    '/pm-retro', 'Zone 5 -- Ship & Learn',
    'Generates a post-launch retrospective and proposes updates to the prodman-context/ '
    'files. Captures what shipped vs. what was planned, success metric actuals, what '
    'worked/did not/surprised, root causes, and durable learnings.',
    'After launch, once you have 30-day metric data. Run this before the next feature cycle.',
    '/pm-retro [feature name and brief outcome summary]',
    'Paste pm-retro.md into chat with the feature and result context.',
    'retro.md written to features/[name]/. Proposed updates to prodman-context/ files for PM to confirm.',
)

# -- 6.12 pm-import ------------------------------------------------------------
pdf.add_page()
pdf.command_card(
    '/pm-import', 'Utility',
    'Bootstraps prodman-context/ from existing product documentation. Accepts pasted text, '
    'file contents, or a structured interview. Writes all four context files: product.md, '
    'users.md, constraints.md, and history.md.',
    'When starting ProdMan on an existing product that already has documentation, PRDs, '
    'pitch decks, or team wikis you can paste in.',
    '/pm-import [paste existing docs here]',
    'Paste pm-import.md into chat, then paste your existing documentation.',
    'Four files written to prodman-context/. Review and fill in gaps before running other commands.',
)

pdf.callout(
    'If you paste nothing, /pm-import runs a structured interview -- four questions, '
    'one at a time -- and writes the context files from your answers. This is the '
    'fastest way to get started with a new product.',
    style='tip'
)


# ==============================================================================
# 7. END-TO-END WORKFLOW WALKTHROUGH
# ==============================================================================
pdf.add_page()
pdf.h1('7. End-to-End Workflow Walkthrough')

pdf.body(
    'This walkthrough follows a fictional PM -- Alex -- working on Acme, the B2B '
    'invoicing tool from the product context examples earlier.'
)

steps = [
    ('Alex notices a signal',
     '/pm-signal',
     '"Our checkout abandonment rate jumped 15% after last week\'s navigation redesign. '
     'Support is seeing tickets tagged \'can\'t find invoice history\'."',
     'ProdMan identifies it as a metric + support spike correlated with a product change. '
     'Asks: "Which users are raising these tickets -- new users who never found the page, '
     'or existing users who knew where it was?"'),

    ('Alex answers; dialogue continues',
     '/pm-signal (continued)',
     '"Mostly existing users -- agency owners who check invoice history weekly."',
     'ProdMan asks: "What did they do when they couldn\'t find it -- did they contact support '
     'immediately, or did they search around first?" Alex answers. After 3 exchanges, '
     'ProdMan says it is ready to frame.'),

    ('Alex requests framings',
     '/pm-frame',
     '(no arguments -- uses conversation context)',
     'ProdMan generates three framings:\n'
     'Framing 1: Navigation discoverability (the page moved, existing users are lost)\n'
     'Framing 2: Feature salience (invoice history was never prominent enough; the redesign exposed this)\n'
     'Framing 3: Mental model mismatch (agency owners think in "clients", not "invoices")'),

    ('Alex explores the chosen framing',
     '/pm-explore',
     '"I like Framing 1 -- the navigation discoverability problem."',
     'ProdMan asks about frequency, current workarounds, prior attempts, success criteria, '
     'and constraints. Alex learns that ~40% of agency owners hit this weekly, the workaround '
     'is contacting support, and there is no quick-fix navigation budget.'),

    ('Alex commits to a direction',
     '/pm-commit',
     '(no arguments)',
     'ProdMan produces the Direction Commitment: restore discoverability of invoice history '
     'for existing agency owners via a persistent shortcut in the sidebar, without a full '
     'navigation redesign. Alex confirms.'),

    ('Alex generates the full spec',
     '/pm-ff',
     'order-history-discoverability',
     'ProdMan writes four files to features/order-history-discoverability/: brief.md (1 page), '
     'prd.md (full requirements), approach.md (3 options considered, sidebar shortcut chosen), '
     'plan.md (milestones and comms plan).'),

    ('Alex hands off to engineering',
     '/pm-handoff engineer',
     '(uses the spec files)',
     'ProdMan writes handoff-eng.md: acceptance criteria per user story, edge cases table, '
     'error states, technical notes, open questions, Definition of Done.'),

    ('Alex creates the agent brief',
     '/pm-agent-brief',
     '(uses prd.md and handoff-eng.md)',
     'ProdMan writes agent-brief.md: bounded task, explicit out-of-scope list, testable '
     'acceptance criteria, escalation triggers. Alex pastes this into Claude Code to begin implementation.'),

    ('After launch: retro',
     '/pm-retro',
     '"order-history-discoverability -- shipped, 80% reduction in related tickets in 30 days"',
     'ProdMan writes retro.md and proposes an addition to prodman-context/history.md: '
     '"Navigation changes require a dedicated discoverability audit before shipping."'),
]

for i, (title, cmd, input_text, output_text) in enumerate(steps, 1):
    # Step header
    pdf.set_fill_color(*NAVY)
    pdf.rect(pdf.l_margin, pdf.get_y(), 10, 8, 'F')
    pdf.set_fill_color(*LIGHT_BLUE)
    pdf.rect(pdf.l_margin + 10, pdf.get_y(), pdf._usable_w() - 10, 8, 'F')
    pdf.set_xy(pdf.l_margin + 2, pdf.get_y() + 1.5)
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(*WHITE)
    pdf.cell(8, 5, str(i))
    pdf.set_text_color(*NAVY)
    pdf.cell(70, 5, title)
    pdf.set_font('Courier', 'B', 9)
    pdf.set_text_color(*ACCENT)
    pdf.cell(0, 5, cmd)
    pdf.ln(11)

    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(*MID_GRAY)
    pdf.write(5, 'Input:  ')
    pdf.set_font('Helvetica', 'I', 9)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(0, 5, input_text)
    pdf.ln(1)

    pdf.set_font('Helvetica', 'B', 9)
    pdf.set_text_color(*MID_GRAY)
    pdf.write(5, 'Output:  ')
    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(0, 5, output_text)
    pdf.ln(5)


# ==============================================================================
# 8. OUTPUT LAYERS
# ==============================================================================
pdf.add_page()
pdf.h1('8. Output Layers')

pdf.body(
    'ProdMan produces four distinct output layers from a single committed direction. '
    'Each layer is formatted for a different audience and purpose.'
)

layers = [
    ('Layer 1', 'Spec Bundle', 'brief.md, prd.md, approach.md, plan.md',
     'Internal PM reference. The four files /pm-ff generates. '
     'Source of truth for all subsequent handoffs.'),
    ('Layer 2', 'Stakeholder Brief', 'stakeholder-brief.md',
     'Single-page summary for leadership and non-technical stakeholders. '
     'Generated by /pm-handoff stakeholder.'),
    ('Layer 3', 'Ticket Breakdown', 'tickets.md',
     'Epics, stories, tasks, and spikes formatted for Linear or Jira import. '
     'Each ticket includes acceptance criteria and labels.'),
    ('Layer 4', 'Agent Handover', 'agent-brief.md',
     'Structured brief for AI coding agents. Bounded task, explicit do-not-touch list, '
     'testable acceptance criteria, escalation triggers. Generated by /pm-agent-brief.'),
]

for num, name, files, desc in layers:
    pdf.set_fill_color(*NAVY)
    pdf.set_text_color(*WHITE)
    pdf.set_font('Helvetica', 'B', 10)
    lh = 8
    pdf.cell(20, lh, num, fill=True)
    pdf.set_fill_color(*BLUE)
    pdf.cell(40, lh, name, fill=True)
    pdf.set_fill_color(*LIGHT_BLUE)
    pdf.set_text_color(*NAVY)
    pdf.set_font('Courier', '', 8.5)
    pdf.cell(0, lh, '  ' + files, fill=True, new_x='LMARGIN', new_y='NEXT')
    pdf.set_xy(pdf.l_margin + 4, pdf.get_y())
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(pdf._usable_w() - 4, 5.2, desc)
    pdf.ln(5)

pdf.h2('Feature Folder Structure')

pdf.code_block(
    'features/order-history-discoverability/\n'
    '|-- brief.md               # 1-page summary   -> generated by /pm-ff\n'
    '|-- prd.md                 # Full PRD          -> generated by /pm-ff\n'
    '|-- approach.md            # Decision log      -> generated by /pm-ff\n'
    '|-- plan.md                # Milestones + work -> generated by /pm-ff\n'
    '|-- handoff-eng.md         # Eng handoff       -> generated by /pm-handoff engineer\n'
    '|-- handoff-design.md      # Design handoff    -> generated by /pm-handoff designer\n'
    '|-- stakeholder-brief.md   # 1-page brief      -> generated by /pm-handoff stakeholder\n'
    '|-- agent-brief.md         # AI agent task     -> generated by /pm-agent-brief\n'
    '+-- retro.md               # Post-launch retro -> generated by /pm-retro',
    label='file tree'
)


# ==============================================================================
# 9. INTEGRATION GUIDES
# ==============================================================================
pdf.add_page()
pdf.h1('9. Integration Guides')

pdf.body(
    'ProdMan works in any AI interface. This section summarises setup for the four '
    'primary integrations. Full details are in the integrations/ folder.'
)

pdf.h2('VS Code + Claude Code (Recommended)')
pdf.body(
    'The native experience. Slash commands, automatic context loading via CLAUDE.md, '
    'and direct file writing to your workspace.'
)
numbered_steps = [
    'Clone or copy ProdMan into your workspace.',
    'Run: mkdir prodman-context && cp templates/context/*.md prodman-context/',
    'Fill in prodman-context/product.md and prodman-context/users.md.',
    'Open the folder in VS Code with Claude Code installed.',
    'Type / in the Claude Code chat panel and select /pm-signal to begin.',
]
for i, s in enumerate(numbered_steps, 1):
    pdf.numbered(i, s)

pdf.ln(3)
pdf.callout(
    'CLAUDE.md is automatically loaded by Claude Code when you open the project. '
    'It instructs Claude to load prodman-context/ before every /pm- command. '
    'You do not need to paste context manually.',
    style='info'
)

pdf.h2('Cursor')
pdf.body('Add the ProdMan Cursor Rule to get context-aware command support.')
steps_cursor = [
    'Create .cursor/rules/prodman.mdc (template in integrations/cursor.md).',
    'Run: mkdir prodman-context and fill in the two required context files.',
    'In Cursor chat: "Run /pm-signal [your signal]"',
    'For spec generation (/pm-ff), use Cursor Composer for multi-file writing.',
]
for i, s in enumerate(steps_cursor, 1):
    pdf.numbered(i, s)

pdf.h2('Claude Projects')
pdf.body('Persistent context across conversations without an IDE.')
steps_cp = [
    'Create a new Project at claude.ai/projects. Name it "ProdMan -- [Product Name]".',
    'Paste the Project Instructions from integrations/claude-projects.md.',
    'Upload prodman-context/product.md and prodman-context/users.md as Project files.',
    'Optionally upload the command files from prodman/commands/ you use most.',
    'Use commands naturally in any conversation: /pm-signal, /pm-frame, etc.',
]
for i, s in enumerate(steps_cp, 1):
    pdf.numbered(i, s)

pdf.h2('Any AI Tool -- Universal Copy-Paste Workflow')
pdf.body(
    'Works in ChatGPT, Gemini, Mistral, Perplexity, or any AI that accepts chat input.'
)
pdf.code_block(
    '1. Open prodman/commands/pm-signal.md\n'
    '2. Copy the entire file contents\n'
    '3. Paste into your AI chat as the first message\n'
    '4. Then paste your product context (product.md + users.md)\n'
    '5. Add your signal after $ARGUMENTS\n'
    '6. Send',
    label='copy-paste workflow'
)
pdf.body(
    'For subsequent commands in the same session: paste the next command file, then '
    'type your input. The AI retains conversation context between pastes.'
)

pdf.h2('Integration Comparison')
rows = [
    ('Feature', 'Claude Code', 'Cursor', 'Claude Projects', 'Universal'),
    ('Native slash commands', 'Yes', 'No (chat)', 'No (chat)', 'No'),
    ('Auto-loads context', 'Yes (CLAUDE.md)', 'Yes (Rule)', 'Yes (uploads)', 'Manual paste'),
    ('Direct file writing', 'Yes', 'Yes (Composer)', 'Copy-paste', 'Copy-paste'),
    ('Persistent memory', 'Session', 'Session', 'Project', 'Session'),
    ('Works offline', 'No', 'No', 'No', 'No'),
]
pdf.multi_col_table(rows[1:], header=rows[0])


# ==============================================================================
# 10. TIPS & BEST PRACTICES
# ==============================================================================
pdf.add_page()
pdf.h1('10. Tips & Best Practices')

pdf.h2('Context Quality')
tips_context = [
    'Fill in prodman-context/users.md before anything else. "Users" is not a segment. Name each segment and describe their job-to-be-done explicitly.',
    'Keep product.md short and honest. If your positioning is unclear to you, it will be unclear to the AI. Clarify it here before speccing features.',
    'Update history.md after every retro. The decisions-already-made section prevents your team re-litigating the same debates.',
    'Add constraints.md when your team hits blockers. It prevents commands from suggesting solutions that are technically or organisationally impossible.',
]
for t in tips_context:
    pdf.bullet(t)

pdf.h2('Workflow Patterns')
tips_workflow = [
    'One conversation per feature. Do not mix features in the same chat session -- context drift degrades output quality.',
    'Copy spec outputs immediately. Do not rely on chat history. Copy /pm-ff outputs to features/ right after generation.',
    'Sparse signal? Use /pm-signal. Rich context? Start with /pm-commit. Very clear direction? Go straight to /pm-ff.',
    'Run /pm-explore whenever /pm-frame surfaces a framing you like but cannot fully defend. The exploration dialogue surfaces the gaps.',
    'Iterate on specific sections rather than regenerating everything. "The P0 user stories are too generic -- rewrite them for the Agency Owner segment" works better than "redo the PRD".',
]
for t in tips_workflow:
    pdf.bullet(t)

pdf.h2('Handoff Quality')
tips_handoff = [
    'The engineering handoff is only as good as the acceptance criteria. Before running /pm-handoff engineer, re-read the user stories in the PRD and make sure they are specific.',
    'For agent briefs, the "Must NOT do" list is as important as the "Must implement" list. Agents will fill gaps with their best guess -- tell them explicitly where not to wander.',
    'Run /pm-handoff stakeholder before any review meeting. It forces you to state success metrics in plain language, which often exposes gaps in your own thinking.',
]
for t in tips_handoff:
    pdf.bullet(t)

pdf.h2('Common Mistakes')

mistakes = [
    ('Skipping /pm-signal and going straight to /pm-ff',
     'The spec will be built on an unexamined problem. The most expensive bugs are the ones '
     'that come from building the wrong thing cleanly. Take 10 minutes in Zone 1 first.'),
    ('Using generic user references in specs',
     '"Users can search for invoices" is weaker than "Agency Owners can search invoices '
     'by client name." Specificity in the spec becomes specificity in the implementation.'),
    ('Ignoring the "Out of scope" sections',
     'Every explicit out-of-scope item prevents a future scope creep conversation. '
     'If you do not fill it in, someone will assume it is in scope.'),
    ('Not updating prodman-context/ after a retro',
     'The history file is the only thing preventing your team from having the same '
     'conversations repeatedly. Fill it in after every major feature.'),
]

for mistake, fix in mistakes:
    pdf.set_fill_color(*AMBER_BG)
    pdf.set_draw_color(*AMBER_LINE)
    w = pdf._usable_w()
    n1 = len(pdf.multi_cell(w - 8, 5, mistake, dry_run=True, output='LINES'))
    n2 = len(pdf.multi_cell(w - 8, 5, 'Fix: ' + fix, dry_run=True, output='LINES'))
    h = (n1 + n2) * 5 + 10
    pdf.rect(pdf.l_margin, pdf.get_y(), 3, h, 'F')
    pdf.rect(pdf.l_margin + 3, pdf.get_y(), w - 3, h, 'F')
    pdf.set_xy(pdf.l_margin + 7, pdf.get_y() + 3)
    pdf.set_font('Helvetica', 'B', 9.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.multi_cell(w - 14, 5, '(!)  ' + mistake)
    pdf.set_font('Helvetica', '', 9.5)
    pdf.set_text_color(*DARK_GRAY)
    pdf.set_x(pdf.l_margin + 7)
    pdf.multi_cell(w - 14, 5, 'Fix: ' + fix)
    pdf.set_y(pdf.get_y() + 3)

pdf.ln(4)
pdf.divider()

pdf.h2('Getting Help')
pdf.body(
    'ProdMan is open source. If you find a bug in a command prompt, a gap in the output '
    'schema, or want to add an integration guide, contributions are welcome.'
)
pdf.bullet('Read CONTRIBUTING.md for prompt quality guidelines and the PR process.')
pdf.bullet('File issues at the repository for bugs, unclear output, or missing commands.')
pdf.bullet('The most valuable contributions are real (anonymised) example outputs from your own PM work.')


# ==============================================================================
# Save
# ==============================================================================
output_path = r'C:\Users\Vissu\OneDrive\Documents\Claude\ProdMan\ProdMan_User_Guide.pdf'
pdf.output(output_path)
print(f'PDF written to: {output_path}')
print(f'Pages: {pdf.page}')
