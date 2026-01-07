import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileApi } from '../services/api';
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
          gender: 'male',
          height: 70,
          weight: 150,
          activity_level: 'moderately_active',
          weight_goal_type: 'maintain',
          weight_change_per_week: 0.5,
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
      <div className="text-center">Loading profile...</div>
    );
  }

  return (
    <>
      <div>
        <div className="mb-6">
          <Link
            to="/users"
            className="text-indigo-600 hover:text-indigo-900 mb-4 inline-block"
          >
            ← Back to Users
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900">User Profile</h1>
            {profile && !editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
              <p className="text-slate-600 mb-4">
                No profile found. Create one to start generating meal plans.
              </p>
              <button
                onClick={() => setEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      required
                      disabled={!editing && !profile}
                      value={formData.gender || 'male'}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })
                      }
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Activity Level
                    </label>
                    <select
                      required
                      disabled={!editing && !profile}
                      value={formData.activity_level || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, activity_level: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="lightly_active">Lightly Active</option>
                      <option value="moderately_active">Moderately Active</option>
                      <option value="very_active">Very Active</option>
                      <option value="extra_active">Extra Active</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Current Weight (lbs)
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
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Weight Goals */}
              <div className="mb-8 border-t border-slate-200 pt-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Weight Goals</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Weight Goal
                    </label>
                    <select
                      required
                      disabled={!editing && !profile}
                      value={formData.weight_goal_type || 'maintain'}
                      onChange={(e) =>
                        setFormData({ ...formData, weight_goal_type: e.target.value as 'lose' | 'maintain' | 'gain' })
                      }
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    >
                      <option value="lose">Lose Weight</option>
                      <option value="maintain">Maintain Weight</option>
                      <option value="gain">Gain Weight</option>
                    </select>
                  </div>

                  {(formData.weight_goal_type === 'lose' || formData.weight_goal_type === 'gain') && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Goal Weight (lbs)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        disabled={!editing && !profile}
                        value={formData.goal_weight || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, goal_weight: parseFloat(e.target.value) })
                        }
                        className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                        placeholder="Optional"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Weight Change Per Week (lbs)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="5"
                      required
                      disabled={!editing && !profile || formData.weight_goal_type === 'maintain'}
                      value={formData.weight_change_per_week || 0}
                      onChange={(e) =>
                        setFormData({ ...formData, weight_change_per_week: parseFloat(e.target.value) })
                      }
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Recommended: 0.5-2 lbs per week
                    </p>
                  </div>
                </div>
              </div>

              {/* Calculated Values */}
              {(profile?.bmr || profile?.tdee) && (
                <div className="mb-8 border-t border-slate-200 pt-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Calculated Values</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {profile.bmr && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-700 mb-1">BMR (Basal Metabolic Rate)</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {Math.round(profile.bmr)} <span className="text-sm font-normal">cal/day</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">Calories burned at rest</div>
                      </div>
                    )}
                    {profile.tdee && (
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <div className="text-sm font-medium text-emerald-700 mb-1">TDEE (Total Daily Energy Expenditure)</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {Math.round(profile.tdee)} <span className="text-sm font-normal">cal/day</span>
                        </div>
                        <div className="text-xs text-emerald-600 mt-1">Calories burned with activity</div>
                      </div>
                    )}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-purple-700 mb-1">Calorie Target</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {formData.calorie_target || profile?.calorie_target || 0} <span className="text-sm font-normal">cal/day</span>
                      </div>
                      <div className="text-xs text-purple-600 mt-1">Auto-calculated from BMR and goals</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Macro Targets */}
              <div className="mb-8 border-t border-slate-200 pt-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Macro Targets</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-md px-3 py-2 disabled:bg-slate-100"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Macro targets are auto-calculated based on calorie target (30% protein, 40% carbs, 30% fat)
                </p>
              </div>

              {editing && (
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
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
                    className="bg-slate-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default UserProfile;
