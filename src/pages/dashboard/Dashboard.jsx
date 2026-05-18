import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { Clock, BookOpen, TrendingUp, Flame, BarChart3 } from 'lucide-react';
import Button from '../../components/ui/Button';
import { formatDuration } from '../../utils/formatDate';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [recentTopics, setRecentTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyStats, setDifficultyStats] = useState({
    beginner: { count: 0, duration: 0 },
    intermediate: { count: 0, duration: 0 },
    advanced: { count: 0, duration: 0 },
    expert: { count: 0, duration: 0 },
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/dashboard/stats');
      setStats(statsRes.data.data);

      const weeklyRes = await api.get('/dashboard/weekly-summary');
      setWeeklyData(weeklyRes.data.data);

      const recentRes = await api.get('/dashboard/recent-topics');
      setRecentTopics(recentRes.data.data.recentTopics || []);

      calculateDifficultyStats(recentRes.data.data.recentTopics || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);

      setStats({
        totalStudyHours: 0,
        totalEntries: 0,
        entriesThisWeek: 0,
        studyStreak: 0,
      });
      setWeeklyData({ weeklyData: [], weeklyTotals: { totalStudyHours: 0, totalEntries: 0 } });
      setRecentTopics([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDifficultyStats = (topics) => {
    const stats = {
      beginner: { count: 0, duration: 0 },
      intermediate: { count: 0, duration: 0 },
      advanced: { count: 0, duration: 0 },
      expert: { count: 0, duration: 0 },
    };

    topics.forEach((topic) => {
      if (stats.hasOwnProperty(topic.difficultyLevel)) {
        stats[topic.difficultyLevel].count++;
        stats[topic.difficultyLevel].duration += topic.studyDuration || 0;
      }
    });

    setDifficultyStats(stats);
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Track your learning progress</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <StatCard
          title="Total Study Hours"
          value={stats?.totalStudyHours ? `${parseFloat(stats.totalStudyHours).toFixed(1)}h` : '0h'}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Total Entries"
          value={stats?.totalEntries || 0}
          icon={BookOpen}
          color="green"
        />
        <StatCard
          title="This Week"
          value={stats?.entriesThisWeek || 0}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="Study Streak"
          value={`${stats?.studyStreak || 0} days`}
          icon={Flame}
          color="orange"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Learning Summary
            </h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-indigo-200">
              <p className="text-xs sm:text-sm font-medium text-indigo-600 mb-2">Total Entries</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-700">{stats?.totalEntries || 0}</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-cyan-200">
              <p className="text-xs sm:text-sm font-medium text-cyan-600 mb-2">Total Duration</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-700">{stats?.totalStudyHours || 0}h</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-slate-200">
              <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Beginner</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700">{difficultyStats.beginner.count}</p>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">{difficultyStats.beginner.duration}m</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-amber-200">
              <p className="text-xs sm:text-sm font-medium text-amber-600 mb-1">Intermediate</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-700">{difficultyStats.intermediate.count}</p>
              <p className="text-xs sm:text-sm text-amber-600 mt-1 font-medium">{difficultyStats.intermediate.duration}m</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-orange-200">
              <p className="text-xs sm:text-sm font-medium text-orange-600 mb-1">Advanced</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-700">{difficultyStats.advanced.count}</p>
              <p className="text-xs sm:text-sm text-orange-600 mt-1 font-medium">{difficultyStats.advanced.duration}m</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 sm:p-4 lg:p-5 border border-red-200">
              <p className="text-xs sm:text-sm font-medium text-red-600 mb-1">Expert</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-700">{difficultyStats.expert.count}</p>
              <p className="text-xs sm:text-sm text-red-600 mt-1 font-medium">{difficultyStats.expert.duration}m</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Weekly Overview</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Total: {weeklyData?.weeklyTotals?.totalStudyHours ? parseFloat(weeklyData.weeklyTotals.totalStudyHours).toFixed(1) : 0}h • {weeklyData?.weeklyTotals?.totalEntries || 0} entries
          </p>
        </CardHeader>
        <CardBody>
          {weeklyData?.weeklyData && weeklyData.weeklyData.length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
              {weeklyData.weeklyData.map((day) => (
                <div key={day.date} className="flex items-center gap-3 sm:gap-4">
                  <div className="w-14 sm:w-16 text-sm sm:text-base font-medium text-gray-700">{day.dayName}</div>
                  <div className="flex-1 h-8 sm:h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.min((parseFloat(day.studyHours) / 8) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="w-16 sm:w-20 text-sm sm:text-base text-gray-900 font-semibold text-right">
                    {parseFloat(day.studyHours).toFixed(1)}h
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base text-gray-500">No study data for this week yet</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Topics</h3>
        </CardHeader>
        <CardBody>
          {recentTopics.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {recentTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="p-4 sm:p-5 bg-white border border-gray-200 rounded-lg transition-all duration-200 cursor-pointer"
                >
                  <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2">{topic.topicName}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {formatDuration(topic.studyDuration)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span>{new Date(topic.studyDate).toLocaleDateString()}</span>
                  </div>
                  <Badge variant={getDifficultyVariant(topic.difficultyLevel)} className="px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full">
                    {DIFFICULTY_LEVELS[topic.difficultyLevel]?.label || topic.difficultyLevel}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <p className="text-sm sm:text-base text-gray-500 mb-2">No recent topics yet</p>
              <p className="text-xs sm:text-sm text-gray-400">Start learning and track your progress!</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card hover>
      <CardBody>
        <div className="flex flex-col gap-2 min-h-[80px] sm:min-h-[90px]">
          <div className={`p-2 sm:p-2.5 rounded-lg ${colors[color]} w-fit`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-0.5">{title}</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      </CardBody>
    </Card>
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

export default Dashboard;
