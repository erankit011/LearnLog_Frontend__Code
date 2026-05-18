import { BookOpen, FileText, Search, Plus } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = BookOpen,
  title,
  description,
  action,
  actionText
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-3 sm:px-4 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-sm">{description}</p>
      {action && <Button onClick={action}>{actionText}</Button>}
    </div>
  );
};

export const EmptyJournal = ({ onAdd }) => (
  <EmptyState
    icon={BookOpen}
    title="No journal entries yet"
    description="Start tracking your learning journey by adding your first journal entry."
    action={onAdd}
    actionText="Add Entry"
  />
);

export const EmptySearch = () => (
  <EmptyState
    icon={Search}
    title="No results found"
    description="We couldn't find any entries matching your search. Try different keywords."
  />
);

export const EmptyProfile = () => (
  <EmptyState
    icon={FileText}
    title="No activity yet"
    description="Start learning and track your progress to see your statistics here."
  />
);

export default EmptyState;
