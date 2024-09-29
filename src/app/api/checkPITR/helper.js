
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'apikey': API_KEY,
  'Content-Type': 'application/json'
};

export async function checkPITR() {

  try {
    const response = await fetch(`https://api.supabase.com/v1/projects`, {
        headers
      });
    
      if (!response.ok) throw new Error('Failed to fetch project details');
    
      const projectDetails = await response.json();
      console.log("all projects:",projectDetails);

      const projectStatus = projects.map(project => ({
        project: project.name,
        pitrEnabled: project.pitr_enabled ? "Yes" : "No",
        pitrValue: project.pitr_value || "N/A"
    }));
    return projectStatus
  } catch (error) {
    return error
  }
}
