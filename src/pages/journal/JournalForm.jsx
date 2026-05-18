import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { showSuccess, showError } from '../../utils/toastNotification';
import Card, { CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';

const JournalForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    topicName: '',
    description: '',
    studyDuration: '',
    difficultyLevel: 'beginner',
    studyDate: new Date().toISOString().split('T')[0],
    tags: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit) {
      fetchJournal();
    }
  }, [id]);

  const fetchJournal = async () => {
    try {
      const response = await api.get(`/journals/${id}`);
      const journal = response.data.data.journal;
      setFormData({
        topicName: journal.topicName,
        description: journal.description,
        studyDuration: journal.studyDuration,
        difficultyLevel: journal.difficultyLevel,
        studyDate: new Date(journal.studyDate).toISOString().split('T')[0],
        tags: journal.tags?.join(', ') || '',
        notes: journal.notes || '',
      });
    } catch (error) {
      showError('Failed to fetch journal entry');
      navigate('/journal');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'studyDuration') {
      const numValue = value === '' ? '' : parseInt(value, 10);
      if (numValue === '' || !isNaN(numValue)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.topicName.trim()) {
      newErrors.topicName = 'Topic name is required';
    } else if (formData.topicName.trim().length < 2) {
      newErrors.topicName = 'Topic name must be at least 2 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.studyDuration) {
      newErrors.studyDuration = 'Study duration is required';
    } else if (parseInt(formData.studyDuration) < 1) {
      newErrors.studyDuration = 'Duration must be at least 1 minute';
    } else if (parseInt(formData.studyDuration) > 1440) {
      newErrors.studyDuration = 'Duration cannot exceed 24 hours (1440 minutes)';
    }

    if (!formData.studyDate) {
      newErrors.studyDate = 'Study date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        studyDuration: parseInt(formData.studyDuration),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      };

      if (isEdit) {
        await api.patch(`/journals/${id}`, payload);
        showSuccess('Journal entry updated successfully');
      } else {
        await api.post('/journals', payload);
        showSuccess('Journal entry created successfully');
      }

      navigate('/journal');
    } catch (error) {
      showError(error.response?.data?.message || (isEdit ? 'Failed to update entry' : 'Failed to create entry'));
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1">
            {isEdit ? 'Edit Entry' : 'Add New Entry'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {isEdit ? 'Update your learning progress' : 'Record your learning session'}
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <Input
              label="Topic Name"
              name="topicName"
              placeholder="What did you learn?"
              value={formData.topicName}
              onChange={handleChange}
              error={errors.topicName}
              required
              className="min-h-[44px]"
            />

            <Textarea
              label="Description"
              name="description"
              placeholder="Describe what you learned..."
              rows={5}
              value={formData.description}
              onChange={handleChange}
              error={errors.description}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Study Duration (minutes)"
                type="number"
                name="studyDuration"
                placeholder="60"
                value={formData.studyDuration}
                onChange={handleChange}
                error={errors.studyDuration}
                required
                min="1"
                max="1440"
                className="min-h-[44px]"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <Select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleChange}
                  className="min-h-[44px]"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </Select>
              </div>
            </div>

            <Input
              label="Study Date"
              type="date"
              name="studyDate"
              value={formData.studyDate}
              onChange={handleChange}
              error={errors.studyDate}
              required
              className="min-h-[44px]"
            />

            <Input
              label="Tags (comma separated)"
              name="tags"
              placeholder="Your Subject Name"
              value={formData.tags}
              onChange={handleChange}
              className="min-h-[44px]"
            />

            <Textarea
              label="Notes (optional)"
              name="notes"
              placeholder="Additional notes or thoughts..."
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/journal')}
                className="w-full sm:flex-1 min-h-[44px]"
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={loading} className="w-full sm:flex-1 min-h-[44px]">
                {isEdit ? 'Update Entry' : 'Create Entry'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default JournalForm;
