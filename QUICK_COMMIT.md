# Quick Git Commit Guide

## Super Fast Commit (One Command)
```bash
git add . && git commit -m "Your message" && git push
```

## Standard Fast Commit (3 Commands)
```bash
git add .
git commit -m "Your commit message"
git push
```

## Commit Specific Files Only
```bash
git add file1.js file2.html
git commit -m "Updated specific files"
git push
```

## Amend Last Commit (if you forgot something)
```bash
git add .
git commit --amend --no-edit
git push --force
```

## Quick Status Check
```bash
git status
```

## View Recent Commits
```bash
git log --oneline -5
```

---

## Common Commit Messages for This Project

- `git commit -m "Added email functionality to contact form"`
- `git commit -m "Fixed nodemailer configuration"`
- `git commit -m "Updated contact form with email integration"`
- `git commit -m "Added backend email service"`
- `git commit -m "WIP: Working on email feature"`
