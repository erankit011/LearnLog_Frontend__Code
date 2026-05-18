import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import Modal from '../../components/ui/Modal';
import { Edit, Trash2, Clock, Calendar, Tag } from 'lucide-react';
import { formatDuration, formatDate } from '../../utils/formatDate';
import { DIFFICULTY_LEVELS } from '../../utils/constants';

const JournalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [journal, setJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchJournal();
  }, [id]);

  const fetchJournal = async () => {
    try {
      const response = await api.get(`/journals/${id}`);
      setJournal(response.data.data.journal);
    } catch (error) {
      toast.error('Failed to fetch journal entry');
      navigate('/journal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/journals/${id}`);
      toast.success('Journal entry deleted successfully');
      navigate('/journal');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  if (!journal) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-3">
                {journal.topicName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  {formatDuration(journal.studyDuration)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  {formatDate(journal.studyDate)}
                </span>
              </div>
            </div>
            <Badge variant={getDifficultyVariant(journal.difficultyLevel)} className="px-4 py-2 text-xs sm:text-sm font-semibold">
              {DIFFICULTY_LEVELS[journal.difficultyLevel]?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Description</h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{journal.description}</p>
            </div>

            {journal.tags && journal.tags.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {journal.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3.5 py-1.5 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm sm:text-base font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {journal.notes && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Notes</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{journal.notes}</p>
              </div>
            )}

            {journal.resources && journal.resources.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Resources</h3>
                <ul className="space-y-2.5">
                  {journal.resources.map((resource, index) => (
                    <li key={index}>
                      <a
                        href={resource}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base text-blue-600 hover:text-blue-700 hover:underline break-all"
                      >
                        {resource}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
              <Link to={`/journal/${journal._id}/edit`} className="flex-1">
                <Button variant="secondary" className="w-full min-h-[44px]">
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Entry
                </Button>
              </Link>
              <Button
                variant="danger"
                onClick={() => setDeleteModalOpen(true)}
                className="flex-1 min-h-[44px]"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Entry
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Entry"
      >
        <div className="space-y-5">
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Are you sure you want to delete this journal entry? This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              className="w-full sm:flex-1 min-h-[44px]"
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} className="w-full sm:flex-1 min-h-[44px]">
              Delete Entry
            </Button>
          </div>
        </div>
      </Modal>
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

export default JournalDetail;
