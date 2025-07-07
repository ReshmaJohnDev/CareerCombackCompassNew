from apscheduler.schedulers.blocking import BlockingScheduler
from ActionPlanner.scheduler.due_reminders import run_due_reminders

scheduler = BlockingScheduler()

scheduler.add_job(
    run_due_reminders,
    'interval',
    minutes=10,
    misfire_grace_time=300
)

if __name__ == "__main__":
    print("✅ Starting scheduler worker...")
    scheduler.start()