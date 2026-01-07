import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileApi, userApi } from '../services/api';
import type { UserProfile as UserProfileType } from '../types';

function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileType>>({});

  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await profileApi.get(parseInt(userId));
      setProfile(data);
      setFormData(data);
      setError(null);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProfile(null);
        setFormData({
          age: 30,
          height: 70,
          weight: 150,
          activity_level: 'moderately_active',
          calorie_target: 2000,
          protein_target: 150,
          carb_target: 200,
          fat_target: 65,
        });
      } else {
        setError(err.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      if (profile) {
        await profileApi.update(parseInt(userId), formData);
      } else {
        await profileApi.create(parseInt(userId), formData);
      }
      setEditing(false);
      loadProfile();
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/users"
            className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
          >
            ← Back to Users
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            {profile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          {!profile && !editing ? (
            <div>
              <p className="text-gray-600 mb-4">
                No profile found. Create one to start generating meal plans.
              </p>
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Create Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    required
                    disabled={!editing && !profile}
                    value={formData.age || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, age: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={!editing && !profile}
                    value={formData.height || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, height: parseFloat(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={!editing && !profile}
                    value={formData.weight || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Level
                  </label>
                  <select
                    required
                    disabled={!editing && !profile}
                    value={formData.activity_level || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, activity_level: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="lightly_active">Lightly Active</option>
                    <option value="moderately_active">Moderately Active</option>
                    <option value="very_active">Very Active</option>
                    <option value="extra_active">Extra Active</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calorie Target
                  </label>
                  <input
                    type="number"
                    required
                    disabled={!editing && !profile}
                    value={formData.calorie_target || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        calorie_target: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Protein Target (g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={!editing && !profile}
                    value={formData.protein_target || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        protein_target: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Carb Target (g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={!editing && !profile}
                    value={formData.carb_target || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        carb_target: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fat Target (g)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    disabled={!editing && !profile}
                    value={formData.fat_target || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        fat_target: parseFloat(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {editing && (
                <div className="mt-6 flex space-x-4">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      if (profile) {
                        setFormData(profile);
                      }
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

