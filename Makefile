# Makefile for building resume.pdf and copying to React public folder

# Paths
RESUME_SRC := resume.tex
RESUME_PDF := resume.pdf
REACT_PUBLIC := ../gaudin/public

# Default target
all: build copy

# Compile the PDF in the current directory
build:
	pdflatex $(RESUME_SRC)

# Copy the PDF to the React public folder
copy: build
	cp $(RESUME_PDF) $(REACT_PUBLIC)/

# Clean auxiliary TeX files
clean:
	rm -f *.aux *.log *.out *.toc

.PHONY: all build copy clean