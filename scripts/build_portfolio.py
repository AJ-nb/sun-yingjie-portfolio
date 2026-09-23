"""Build the complete archive with the same v7 publication engine and facts."""
import sys
from build_selected_v5 import build
if __name__=='__main__':
    if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
    build('full','--plan' in sys.argv)
