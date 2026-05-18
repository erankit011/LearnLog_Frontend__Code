import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Search, Plus, Clock, BookOpen, X, Calendar, BarChart3 } from 'lucide-react';
import { formatDuration, formatDate } from '../../utils/formatDate';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

const JournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    startDate: '',
    page: 1,
  });
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchJournals();
  }, [filters]);

  const fetchJournals = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.startDate) {
        const [day, month, year] = filters.startDate.split('/');
        const isoDate = `${year}-${month}-${day}`;
        params.append('startDate', isoDate);
      }
      params.append('page', filters.page);

      const response = await api.get(`/journals?${params.toString()}`);
      setJournals(response.data.data.journals);
      
      calculateSummary(response.data.data.journals);
    } catch (error) {
      console.error('Failed to fetch journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (journalList) => {
    const stats = {
      total: journalList.length,
      totalDuration: 0,
      byDifficulty: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0,
      },
      durationByDifficulty: {
        beginner: 0,
        intermediate: 0,
        advanced: 0,
        expert: 0,
      },
    };

    journalList.forEach((journal) => {
      stats.totalDuration += journal.studyDuration || 0;
      stats.byDifficulty[journal.difficultyLevel] = (stats.byDifficulty[journal.difficultyLevel] || 0) + 1;
      stats.durationByDifficulty[journal.difficultyLevel] = (stats.durationByDifficulty[journal.difficultyLevel] || 0) + (journal.studyDuration || 0);
    });

    setSummary(stats);
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, difficulty: e.target.value, page: 1 });
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [year, month, day] = value.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      setFilters({ ...filters, startDate: formattedDate, page: 1 });
    } else {
      setFilters({ ...filters, startDate: '', page: 1 });
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      difficulty: '',
      startDate: '',
      page: 1,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 lg:px-0 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">Learning Journal</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your learning progress</p>
        </div>
        <Link to="/journal/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto min-h-[44px]">
            <Plus className="h-5 w-5 mr-2" />
            Add Entry
          </Button>
        </Link>
      </div>

      {}
      <Card>
        <CardBody>
          <div className="space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <Input
                  placeholder="Search topics..."
                  icon={Search}
                  value={filters.search}
                  onChange={handleSearch}
                  className="min-h-[44px]"
                />
              </div>
              <div className="w-full sm:w-52">
                <Select value={filters.difficulty} onChange={handleFilterChange} className="min-h-[44px]">
                  <option value="">All Difficulties</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1.5" />
                  Filter by Date (DD/MM/YYYY)
                </label>
                <Input
                  type="date"
                  value={
                    filters.startDate
                      ? (() => {
                          const [day, month, year] = filters.startDate.split('/');
                          return `${year}-${month}-${day}`;
                        })()
                      : ''
                  }
                  onChange={handleDateChange}
                  className="min-h-[44px]"
                  placeholder="dd/mm/yyyy"
                />
                {filters.startDate && (
                  <p className="text-xs text-gray-500 mt-1.5">
                    Selected: {filters.startDate}
                  </p>
                )}
              </div>
              {(filters.search || filters.difficulty || filters.startDate) && (
                <Button 
                  variant="secondary" 
                  onClick={clearFilters} 
                  className="w-full sm:w-auto min-h-[44px]"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 overflow-wrap-break-word">
                Summary
                {filters.startDate && ` for ${filters.startDate}`}
                {filters.search && ` • Search: "${filters.search}"`}
                {filters.difficulty && ` • ${filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}`}
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-blue-200 transition-shadow">
                <p className="text-xs sm:text-sm font-medium text-blue-600 mb-2">Total Entries</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-700">{summary.total}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-purple-200">
                <p className="text-xs sm:text-sm font-medium text-purple-600 mb-2">Total Duration</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-700">{summary.totalDuration}m</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-slate-200">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Beginner</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700">{summary.byDifficulty.beginner}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{summary.durationByDifficulty.beginner}m</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-amber-200">
                <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">Intermediate</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700">{summary.byDifficulty.intermediate}</p>
                <p className="text-xs sm:text-sm text-amber-600 mt-1 font-medium">{summary.durationByDifficulty.intermediate}m</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-orange-200">
                <p className="text-xs sm:text-sm font-medium text-orange-600 mb-1">Advanced</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-700">{summary.byDifficulty.advanced}</p>
                <p className="text-xs sm:text-sm text-orange-600 mt-1 font-medium">{summary.durationByDifficulty.advanced}m</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-red-200">
                <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Expert</p>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-700">{summary.byDifficulty.expert}</p>
                <p className="text-xs sm:text-sm text-red-600 mt-1 font-medium">{summary.durationByDifficulty.expert}m</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {journals.length > 0 ? (
        <div className="space-y-4 sm:space-y-5">
          {journals.map((journal) => (
            <Card key={journal._id}>
              <CardBody>
                <Link to={`/journal/${journal._id}`} className="block">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2.5">
                        {journal.topicName}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                        {journal.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {formatDuration(journal.studyDuration)}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{formatDate(journal.studyDate)}</span>
                      </div>
                    </div>
                    <div className="self-start">
                      <Badge variant={getDifficultyVariant(journal.difficultyLevel)} className="px-4 py-2 text-xs sm:text-sm font-semibold">
                        {DIFFICULTY_LEVELS[journal.difficultyLevel]?.label}
                      </Badge>
                    </div>
                  </div>
                </Link>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-center py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No entries yet</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-5">Start tracking your learning journey today</p>
              <Link to="/journal/new">
                <Button className="min-h-[44px]">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your Entry
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

const getDifficultyVariant = (level) => {
  const variants = {
    beginner: 'success',
    intermediate: 'primary',
    advanced: 'warning',
    expert: 'danger',
  };
  return variants[level] || 'default';
};

export default JournalList;
