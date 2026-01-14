import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../providers/ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    // Cycle through: system -> light -> dark -> system
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const getIcon = () => {
    if (theme === 'light') {
      return <Sun className="w-5 h-5 transition-transform duration-300" strokeWidth={2} />;
    } else if (theme === 'dark') {
      return <Moon className="w-5 h-5 transition-transform duration-300" strokeWidth={2} />;
    } else {
      return <Monitor className="w-5 h-5 transition-transform duration-300" strokeWidth={2} />;
    }
  };

  const getLabel = () => {
    if (theme === 'light') return 'Light theme';
    if (theme === 'dark') return 'Dark theme';
    return 'System theme';
  };

  return (
    <button
      onClick={handleToggle}
      className="
        relative inline-flex items-center justify-center
        h-10 w-10 rounded-md
        hover:bg-card-hover
        border border-transparent hover:border-border
        text-muted-foreground hover:text-foreground
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-ring
      "
      aria-label={`Switch theme (current: ${getLabel()})`}
      title={getLabel()}
    >
      {getIcon()}
      <span className="sr-only">{getLabel()}</span>
    </button>
  );
}
